# -*- coding: utf-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)

from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.http import JsonResponse, QueryDict
from django.views import View
from django.views.generic import TemplateView

from .models import Task, TaskStatus

__all__ = (
    b'IndexView',
    b'GetTasksView',
)


class IndexView(LoginRequiredMixin, TemplateView):
    template_name = 'base/index.html'


class GetTasksView(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        visible_tasks = list(
            Task.objects.filter(
                Q(status=TaskStatus.OPEN) |
                Q(status__range=[TaskStatus.IN_PROGRESS, TaskStatus.FINISHED], assignee_id=request.user.id)
            )
            .order_by('-id')
            .values()
        )

        return JsonResponse(visible_tasks, safe=False)


class GetTaskStatusesView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        return JsonResponse({
            choice_pair[0]: choice_pair[1]
            for choice_pair in TaskStatus.CHOICES
        })


class UpdateTask(LoginRequiredMixin, View):
    def put(self, request, *args, **kwargs):
        qd = QueryDict(request.body)
        task_id = qd.get('id')
        ui_status = int(qd.get('status'))

        task = Task.objects.get(id=task_id)
        if not task:
            return JsonResponse({"success": False, "message": "Task not found"}, status=404)

        task_status = task.status
        if task_status != ui_status:
            return JsonResponse({"success": False, "message": "Data mismatch error"}, status=409)

        task.status = TaskStatus.next_status(task_status)
        task.assignee_id = request.user.id
        task.save()

        return JsonResponse({"success": True, "status": task.status}, status=200)

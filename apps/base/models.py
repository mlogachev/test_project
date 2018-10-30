# -*- coding: utf-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)

from django.conf import settings
from django.db import models


class TaskStatus(object):
    OPEN = 1
    IN_PROGRESS = 20
    FINISHED = 30

    CHOICES = (
        (OPEN, u'Ожидается'),
        (IN_PROGRESS, u'Принято'),
        (FINISHED, u'Выполнено'),
    )

    @classmethod
    def next_status(cls, task_status):
        if task_status == TaskStatus.OPEN:
            return TaskStatus.IN_PROGRESS
        else:
            return TaskStatus.FINISHED


class Task(models.Model):
    text = models.TextField()
    link = models.URLField(max_length=1024)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    creator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='q', null=False, blank=False, default=1)
    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='tasks', null=True, blank=True)
    status = models.SmallIntegerField(choices=TaskStatus.CHOICES, default=TaskStatus.OPEN)

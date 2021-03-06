# -*- coding: utf-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)

from django.contrib import admin

from base import models


class TaskAdmin(admin.ModelAdmin):
    search_fields = ('text', 'link')
    list_filter = ('status',)
    list_display = (
        'id', 'text', 'link', 'price', 'status', 'assignee'
    )
    list_select_related = ('assignee',)


admin.site.register(models.Task, TaskAdmin)

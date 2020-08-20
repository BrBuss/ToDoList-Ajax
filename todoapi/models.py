from django.db import models
from django.utils import timezone
from django.urls import reverse

# Task Table

class TaskList(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)
    time_created = models.DateTimeField(default=timezone.now)

#Admin page display
    def __str__(self):
        return self.name + '|' + str(self.completed)




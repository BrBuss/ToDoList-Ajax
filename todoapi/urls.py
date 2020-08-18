from . import views
from django.urls import path

urlpatterns = [
    path('', views.task_view, name='task-list'),
    path('detail/<str:pk>', views.task_detail, name='task-detail'),
    path('create/', views.task_create, name='task-create'),
    path('update/<str:pk>', views.task_update, name='task-update'),
    path('delete/<str:pk>', views.task_delete, name='task-delete'),
]
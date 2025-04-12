from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GoalViewSet, TaskViewSet, EventViewSet

router = DefaultRouter()
router.register(r'goals', GoalViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'events', EventViewSet, basename='event')

urlpatterns = [
    path('', include(router.urls)),
] 
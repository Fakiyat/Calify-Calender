from rest_framework import viewsets
from .models import Goal, Task, Event
from .serializers import GoalSerializer, TaskSerializer, EventSerializer
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime

class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.all()
        goal_id = self.request.query_params.get('goal_id', None)
        if goal_id is not None:
            queryset = queryset.filter(goal_id=goal_id)
        return queryset

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    
    def get_queryset(self):
        queryset = Event.objects.all()
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if start_date is not None and end_date is not None:
            try:
                start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
                queryset = queryset.filter(start_time__gte=start, end_time__lte=end)
            except ValueError:
                pass
        
        return queryset

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save(updated_at=timezone.now()) 
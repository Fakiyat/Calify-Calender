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
        start = self.request.query_params.get('start', None)
        end = self.request.query_params.get('end', None)
        
        if start is not None and end is not None:
            try:
                start_date = datetime.fromisoformat(start.replace('Z', '+00:00'))
                end_date = datetime.fromisoformat(end.replace('Z', '+00:00'))
                queryset = queryset.filter(start_time__gte=start_date, end_time__lte=end_date)
            except ValueError:
                pass
        
        return queryset

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save(updated_at=timezone.now()) 
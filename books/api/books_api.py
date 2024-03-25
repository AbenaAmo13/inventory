from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import Books
from .serializers import BooksSerialiser

class BooksApiView(APIView):
    # add permission to check if user is authenticated
    permission_classes = [permissions.IsAuthenticated]


    # 2. Create 
     def post(self, request, *args, **kwargs):
        '''
        Create Books Instance with given books data
        '''
        data = {
            'isbn': request.data.get('task'), 
            'book_name': request.data.get('completed'), 
            'year_group': request.user.id,
            'date_requested' : request.data.get('date_requested')
            'order_status' : request.data.get('order_status')
            'quantity_needed': request.data.get('quantity_needed'),
            'quantity_received': request.data.get('quantity_received')
        }
        serializer = BooksSerialiser(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

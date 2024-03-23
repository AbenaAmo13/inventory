  FROM python:slim-buster

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=enasInventory.settings
# Set work directory
WORKDIR /app
# Install dependencies
COPY requirements.txt /app/
# Install build dependencies
    
RUN pip install --no-cache-dir -r requirements.txt
# Copy the current directory contents into the container at /app
COPY . /app/

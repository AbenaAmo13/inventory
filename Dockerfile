FROM python:slim-buster

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=enasInventory.settings
# Set work directory
WORKDIR /app
# Install dependencies
COPY requirements.txt /app/
# Install build dependencies
COPY . /app/
    
RUN pip install --no-cache-dir -r requirements.txt
# copy entrypoint.sh
COPY entrypoint.sh .
RUN ["chmod", "+x", "./entrypoint.sh"]

RUN chown 600 ./entrypoint.sh
# Copy the current directory contents into the container at /app
ENTRYPOINT ["./entrypoint.sh"]

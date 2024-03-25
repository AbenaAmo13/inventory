#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# Check if the admin user exists
if ! python manage.py shell -c "from django.contrib.auth.models import User; exit(0) if User.objects.filter(username=os.environ.get("DJANGO_SUPERUSER_USERNAME")).exists() else exit(1)" > /dev/null 2>&1; then
    # Create the admin user
    python manage.py createsuperuser --noinput 
    echo "Admin user created."
else
    echo "Admin user already exists."
fi

python manage.py makemigrations
python manage.py migrate

exec "$@"
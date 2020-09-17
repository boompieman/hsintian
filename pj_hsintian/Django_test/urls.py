"""Django_test URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from test_app.views import post_reservation, get_reservation, delete_reservation, get_freetime, get_customer, post_customer, get_group, render_reservation

from hsintianbot.views import callback, generate_rich_menu, send_new_reservation, send_failure_reservation_message

from django.conf import settings
from django.conf.urls.static import static

from test_app.admin import admin_site

urlpatterns = [
    path('admin/', admin_site.urls),
    path('reservation/', render_reservation, name='render_reservation'),
    path('callback/', callback, name='callback'),
    path('rich_menu/', generate_rich_menu, name='rich_menu'),
    path('', render_reservation, name='render_reservation'),
    path('api/send_reservation/post', send_new_reservation, name= 'send_new_reservation'),
    path('api/send_failure_reservation/post', send_failure_reservation_message, name= 'send_failure_reservation'),

    url(r'^api/reservation/post', post_reservation, name='post_reservation'), #line_id name phone #{status : 'success or fail', order name phone date}
    url(r'^api/reservation/get', get_reservation, name='get_reservation'), #?line_id=line_id
    url(r'^api/reservation/delete', delete_reservation, name='delete_reservation'),
    
    
    url(r'^api/freetime/get', get_freetime, name='get_freetime'), #?gid=gid
    url(r'^api/customer/get', get_customer, name='get_customer'), #?line_id=line_id
    url(r'^api/customer/post', post_customer, name='post_customer'), #?line_id=line_id
    url(r'^api/group/get', get_group, name='get_group'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

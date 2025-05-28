"""
URL configuration for sesily project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from chat_box import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("chat_box", views.chat_box, name = 'agai'),
    path("apikey/", views.get_api_key),
    #path('supabase-proxy/', views.supabase_data_proxy, name='supabase_proxy'),
    path("signin/", views.sign_in),
    #path('accounts/login/', auth_views.LoginView.as_view(), name='login'),
    path("signup/", views.sign_up),
    path("dashboard/", views.main_dashboard, name = 'home'),
    path('', views.main_dashboard, name = 'main'),
    path('soil/', views.soil_dashboard, name = 'soil'),
    path('input_point/', views.input_point, name= 'ipoint'),
    path('input_poly/', views.input_poly, name = 'ipoly')
]

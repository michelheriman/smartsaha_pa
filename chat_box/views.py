from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from django.http import JsonResponse
import requests
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

@csrf_exempt
def supabase_data_proxy(request):
    """Proxy requests to Supabase, keeping keys server-side"""
    if request.method == 'POST':
        # Get parameters from the client request
        data = json.loads(request.body)
        table = data.get('table')
        query_params = data.get('query', {})
        
        # Make the actual Supabase request server-side
        headers = {
            'apikey': settings.SUPABASE_KEY,
            'Authorization': f'Bearer {settings.SUPABASE_KEY}'
        }
        
        response = requests.get(
            f"{settings.SUPABASE_URL}/rest/v1/{table}",
            headers=headers,
            params=query_params
        )
        
        # Return the data to the client
        return JsonResponse(response.json(), safe=False)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

#@login_required(login_url='signin/')
def chat_box(request):
    #return HttpResponse("Hello world!")
    host = request.get_host()  # e.g., "example.com" or "localhost:8000"
    scheme = request.scheme    # "http" or "https"
    full_url = f"{scheme}://{host}/apikey/"
    redirect = f"{scheme}://{host}/sigin/"
    return render(request, 'chat_box/chat_box.html', {
        "SUPABASE_URL" : settings.SUPABASE_URL,
        "SUPABASE_KEY" : settings.SUPABASE_KEY,
        "API_KEY" : settings.API_KEY,
        "apilink" : full_url,
        "signin" : redirect
    }) #this is how to load a html file, 

#@login_required  # Optional: restrict to logged-in users
#@login_required(login_url='signin/')
def get_api_key(request):
    data = {"apikey" : settings.API_KEY,
            "supabaseurl" : settings.SUPABASE_URL,
            "supabasekey" : settings.SUPABASE_KEY}
    return JsonResponse(data)

def sign_in(request):
    host = request.get_host()  # e.g., "example.com" or "localhost:8000"
    scheme = request.scheme    # "http" or "https"
    full_url = f"{scheme}://{host}/chat_box"
    api_url = f"{scheme}://{host}/apikey/"
    return render(request, 'login/signin.html', {"main_url" : full_url, "apikey" : api_url})

def sign_up(request):
    host = request.get_host()  # e.g., "example.com" or "localhost:8000"
    scheme = request.scheme    # "http" or "https"
    full_url = f"{scheme}://{host}/chat_box"
    api_url = f"{scheme}://{host}/apikey/"
    return render(request, 'login/signup.html', {"main_url" : full_url, "apikey" : api_url})

def main_dashboard(request):
    return render(request, 'main_smartsaha/index.html')

def soil_dashboard(request):
    return render(request, 'main_smartsaha/soil_dashboard.html')

def input_point(request):
    return render(request, 'main_smartsaha/inputs_.html')

def input_poly(request):
    return render(request, 'main_smartsaha/inputs_polygon.html')
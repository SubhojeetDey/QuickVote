from django.shortcuts import render,redirect
from django.contrib.auth import authenticate,login,logout
from .forms import UserRegisterForm
from django.contrib.auth.decorators import login_required
from .models import CustomUser
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from django import template
from django.contrib import messages


def register(request):
    return render(request,'register.html')
# Create your views here.
def voterVerification(request):
        voter_id = request.GET.get('ver_id')
        return render(request,'voterVerification.html')

def login_user(request):
    data = {}
    if request.method == "POST":
        Aadhar_no = request.POST['Aadhar_no']
        password = request.POST['password_l']
        user = authenticate(request,username=Aadhar_no,password=password)
        print(user)
        if user is not None:
            login(request,user)
            return redirect('/UserDetails')
        else:
            data = {'error' : 'error'}
            return render(request,'kyc.html',data)
    return render(request,'kyc.html',data)

def register_user(request):
    form = UserRegisterForm(request.POST)
    if request.method == 'POST':
        if form.is_valid():
            form.save() # Save user to Database
            # username = form.cleaned_data.get('username') # Get the username that is submitted
            # messages.success(request, f'Account created for {username}!') # Show sucess message when account is created
            return redirect('/') # Redirect user to Homepage
    else:
        form = UserRegisterForm()
    return render(request, 'register.html', {'form': form})
@login_required(login_url='/')
def UserDetails(request):
    save_json(request)
    users = request.user
    data = CustomUser.objects.get(Aadhar_no=users)
    print(users)
    return render(request,'details.html',{'data':data})
def logout_user(request):
    logout(request)
    return redirect('/')

@csrf_exempt
def save_json(request):
    if request.method == "GET":
        # api_url = 'https://api.api-ninjas.com/v1/randomuser'
        # response = requests.get(api_url, headers={'X-Api-Key': 'OSjbLTmTzwjodUIZ3eQmug==naGaQH4VJZkorIJ7'})
        # if response.status_code == requests.codes.ok:
        #     raw_data = dict(response.json())
        #     name = raw_data['name']
        #     address = raw_data['address']
        #     email = raw_data['email']
        url = 'https://randomuser.me/api/'
        response = requests.get(url)
        if response.status_code == 200:
            raw_data=response.json()
            results = raw_data.get('results')
            for res in results:
                data = json.dumps(res)
                name = res.get('name')
                gender = res.get('gender')
                location = res.get('location')
                phone = res.get('phone')
                id = res.get('id')
                Electoral_no =id['value']
                street = location['street']
                city = location['city']
                voter_id = res.get('cell')
                booth = location['city']
                age = res.get('dob')
                print(name['first'],gender,location,phone,id,Electoral_no,street['number'],location['city'])
                
                Aadhar = request.user
                cuser = CustomUser.objects.get(Aadhar_no=Aadhar)
                cuser.Electoral_no = Electoral_no
                cuser.Voter_id = voter_id
                cuser.Phone_no = phone
                cuser.first_name = name['first']
                cuser.last_name = name['last']
                cuser.polling_booth = booth
                cuser.age = age['age']
                cuser.gender = gender
                cuser.address = "{} {} {} {} {}".format('street',street['number'],location['city'],location['state'],location['country'])#'street'+' '+street['number'] +' '+location['city']+' '+location['state']+' '+location['country']
                cuser.save()
def staff(request):
    data ={}
    if request.method == "POST":
        enroll_id = request.POST.get('ver_id')
        try:
            voter_data = CustomUser.objects.get(Aadhar_no=enroll_id)
            print(voter_data)
            data = {'voter':voter_data}
        except:
            error = f"No item found with ID {enroll_id}."
            data = {'error':error}
    return render(request,'voterVerification.html',data)
def biometrics(request):
    enroll_id = request.GET.get('user')
    try:
        voter_data = CustomUser.objects.get(Aadhar_no=enroll_id)
        voter_data.Voted = 'Voted'
        voter_data.save()
    except:
        pass
    return render(request,'thanku.html')
# @csrf_exempt
# def Voted_data(request,enroll_id):
#     url = "/biometrics?enroll={}".format(enroll_id)
#     redirect(url)
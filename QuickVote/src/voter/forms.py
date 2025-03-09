from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class UserRegisterForm(UserCreationForm):
    # polling_booth = forms.CharField(max_length=20)
    # address = forms.CharField(max_length=50)
    email = forms.EmailField(widget=forms.EmailInput(attrs={'placeholder' :'Email', 'style': 'width: 95%;padding: 10px;background: #ffffff;border: 1px black solid;border-radius: 5px;color: #000000;', 'class': 'form-control'}))
    # Configuration
    class Meta:
        model = CustomUser
        fields = ['Aadhar_no','Voter_id', 'email', 'password1', 'password2']
        widgets = {
            'Aadhar_no':forms.TextInput(attrs={'placeholder' :'Aadhar no', 'style': 'width: 95%;padding: 10px;background: #ffffff;border: 1px black solid;border-radius: 5px;color: #000000;', 'class': 'form-control'}),
            'Voter_id':forms.TextInput(attrs={'label':' ','placeholder' :'Voter id', 'style': 'width: 95%;padding: 10px;background: #ffffff;border: 1px black solid;border-radius: 5px;color: #000000;', 'class': 'form-control'}),
            'password1':forms.TextInput(attrs={'placeholder' :'Password', 'style': 'width: 95%;padding: 10px;background: #ffffff;border: 1px black solid;border-radius: 5px;color: #000000;', 'class': 'form-control'}),
            'password2':forms.TextInput(attrs={'placeholder' :'Confirm Password', 'style': 'width: 95%;padding: 10px;background: #ffffff;border: 1px black solid;border-radius: 5px;color: #000000;', 'class': 'form-control'}),
        }

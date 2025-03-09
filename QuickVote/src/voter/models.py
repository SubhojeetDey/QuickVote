from django.db import models
from django.db import models
from django.contrib.auth.models import AbstractUser

from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, Aadhar_no, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not Aadhar_no:
            raise ValueError('The Aadhar no must be set')
        user = self.model(Aadhar_no=Aadhar_no, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, Aadhar_no, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(Aadhar_no, password, **extra_fields)
class CustomUser(AbstractUser):
    username = None
    Aadhar_no = models.CharField(max_length=12,unique=True)
    Voted = models.CharField(max_length=10,default="Not Voted")
    Electoral_no = models.CharField(max_length=150,null=True)
    Voter_id = models.CharField(max_length=150) 
    Phone_no = models.CharField(max_length=150)
    polling_booth = models.CharField(max_length=250,null=True)
    address = models.CharField(max_length=550,null=True)
    age = models.CharField(max_length=50,null=True)
    gender = models.CharField(max_length=50,null=True)
    USERNAME_FIELD = 'Aadhar_no'
    objects = CustomUserManager()

    def __str__(self):
        return self.Aadhar_no



# Create your models here.

# Create your models here.

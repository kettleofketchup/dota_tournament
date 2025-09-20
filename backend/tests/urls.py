from django.urls import path

from common.utils import isTestEnvironment

from .test_auth import login_admin, login_staff, login_user

urlpatterns = [
    path(
        "login-admin/",
        login_admin,
        name="login-admin",
    ),
    path(
        "login-staff/",
        login_staff,
        name="login-staff",
    ),
    path(
        "login-user/",
        login_user,
        name="login-user",
    ),
]

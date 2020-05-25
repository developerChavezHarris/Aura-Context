from django.contrib import admin
from .models import Bot
from .models import Intent
from .models import Svp

# Register your models here.
admin.site.register(Bot)
admin.site.register(Intent)
admin.site.register(Svp)

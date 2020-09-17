from django.contrib import admin
from test_app.models import Customer, Reservation, MasterGroup, Master, Course, Question, OpeningDay
from model_utils import FieldTracker
from datetime import datetime, timezone, timedelta
import pytz
from rangefilter.filter import DateRangeFilter, DateTimeRangeFilter
from redis_manager import RedisManager
from django.contrib.auth.models import User

from test_app.google_calendar import CalendarManager

# Register your models here.
    
CM = CalendarManager()

redis_manager = RedisManager()


class MyAdminSite(admin.AdminSite):
    site_header = '馨田管理員系統'
    site_title = '馨田管理員系統'


class CustomerAdmin(admin.ModelAdmin):
    list_display=('line_id', 'name', 'phone','gender','age','city','district','is_black', 'introducer','register_time')
    list_filter=('is_black',('register_time', DateRangeFilter),)
    search_fields=('name','phone','introducer')
    ordering=('line_id',)


class ReservationAdmin(admin.ModelAdmin):
    
    def delete_selected(self, request, queryset):
        
        for query in queryset:
            try:
                CM.delete_event(m_id=query.master.master_id, event_id=query.event_id)
            except:
                self.message_user(request, query.event_id + " 在Google Calendar 上沒有被清除")
                
            tztaipei = timezone(timedelta(seconds=28800))
                
            reservation_datetime_str = datetime.strftime(query.datetime.astimezone(tztaipei), '%Y%m%d%H%M')
                
            if redis_manager.get_occupied_reservation(query.master.master_id, reservation_datetime_str):
                redis_manager.delete_occupied_reservation(query.master.master_id, reservation_datetime_str)
        
        queryset.delete()
        
    def save_model(self, request, obj, form, change):
        
        reservation_datetime_str = datetime.strftime(obj.datetime, '%Y%m%d%H%M')
        
        if change == False:
                                         
            try:
                
                redis_manager.set_occupied_reservation(obj.master.master_id, reservation_datetime_str)                
                event = CM.write_event(m_id=obj.master.master_id, start_time=obj.datetime, summary=obj.name + obj.phone) 
                obj.event_id = event["id"]
                obj.appointment_time = datetime.now()
                obj.save()
                
            except:
                self.message_user(request, f"{reservation_datetime_str} 在Google Calendar 上新增失敗")
                
                if redis_manager.get_occupied_reservation(obj.master.master_id, reservation_datetime_str):
                    redis_manager.delete_occupied_reservation(obj.master.master_id, reservation_datetime_str)
                    
                return            
            
        else:
            if 'is_cancelled' in form.changed_data:
                if obj.is_cancelled == True:
                    try:
                        CM.delete_event(m_id=obj.master.master_id, event_id=obj.event_id)
                        obj.cancel_time = datetime.now()
                        obj.save()
                        
                        if redis_manager.get_occupied_reservation(obj.master.master_id, reservation_datetime_str):
                            redis_manager.delete_occupied_reservation(obj.master.master_id, reservation_datetime_str)                        
                        
                    except:
                        self.message_user(request, f"{obj.event_id} 在Google Calendar 上沒有被清除")
                        
                else:
                    try:
                        
                        redis_manager.set_occupied_reservation(obj.master.master_id, reservation_datetime_str)                
                        event = CM.write_event(m_id=obj.master.master_id, start_time=obj.datetime, summary=obj.name + obj.phone) 
                        obj.event_id = event["id"]
                        obj.save()
                    except:
                        self.message_user(request, f"{reservation_datetime_str} 在Google Calendar 上新增失敗")
                        
                        if redis_manager.get_occupied_reservation(obj.master.master_id, reservation_datetime_str):
                            redis_manager.delete_occupied_reservation(query.master.master_id, reservation_datetime_str)                            
                        return   
            else:
                obj.save()

    
    delete_selected.short_description = "刪除你所選擇的預約"
        
    list_display=('id', 'customer', 'master', 'datetime', 'appointment_time', 'name', 'phone', 'is_cancelled', 'cancel_time', 'has_sent_remind', 'has_ensured_remind')
    list_filter=(('datetime', DateRangeFilter),'is_cancelled', ('appointment_time', DateRangeFilter), ('cancel_time', DateRangeFilter))
    search_fields=('name','phone','master__name', 'appointment_time', 'cancel_time')
    ordering=('datetime',)
#     actions=[delete_selected]


class MasterGroupAdmin(admin.ModelAdmin):
    list_display=('id','gid', 'name', 'descript', 'image')
    ordering=('gid',)

class MasterAdmin(admin.ModelAdmin):
    
    def save_model(self, request, obj, form, change):
        
        if change:
            
            CM.update_calendar(obj.master_id, summary=obj.master_id+"_"+obj.name)
            
        else:
        
            CM.insert_calendar(obj.master_id+"_"+obj.name)
            
        super(MasterAdmin, self).save_model(request, obj, form, change)
            
    def get_readonly_fields(self, request, obj=None):
        if obj: # obj is not None, so this is an edit
            return ['master_id',] # Return a list or tuple of readonly fields' names
        else: # This is an addition
            return []        
            

    list_display=('master_id', 'name', 'get_groups', 'work_type')
    list_filter=('group',)
    search_fields=('master_id','name')
#     ordering=('group',)

    def get_groups(self, obj):
        display_groups = []
        for group in obj.group.all():
            display_groups.append(group.name)

        return display_groups
    
class CourseAdmin(admin.ModelAdmin):
    list_display=('id', 'title', 'brief_intro', 'detail','image')   
    ordering=('id',)

class QuestionAdmin(admin.ModelAdmin):
    list_display=('key', 'question', 'answer', 'answer_image')
    ordering=('key',)    
    
class OpeningDayAdmin(admin.ModelAdmin):
    list_display=('days',)   
    ordering=('days',)        
    
admin_site = MyAdminSite()   

admin_site.register(User)

admin_site.register(Customer, CustomerAdmin)
admin_site.register(Reservation, ReservationAdmin)
admin_site.register(MasterGroup, MasterGroupAdmin)
admin_site.register(Master, MasterAdmin)
admin_site.register(Course, CourseAdmin)
admin_site.register(Question, QuestionAdmin)
admin_site.register(OpeningDay, OpeningDayAdmin)
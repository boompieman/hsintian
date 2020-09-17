from django.db import models
from datetime import datetime
from test_app.google_calendar import CalendarManager

CM = CalendarManager()


class Customer(models.Model):
    line_id = models.CharField(max_length=128, primary_key=True)
    name = models.CharField(max_length=32)
    phone = models.CharField(max_length=32)
    age = models.CharField(max_length=32)
    gender = models.CharField(max_length=16)
    city = models.CharField(max_length=32)
    district = models.CharField(max_length=32)
    introducer = models.CharField(max_length=32, null=True, blank=True)
    register_time = models.DateTimeField(default=None, blank=True, null=True, editable=False)
    
    is_black = models.BooleanField(default=False, verbose_name="blacklist")

    def __str__(self):
        return "{}_{}".format(self.name, self.phone)


class MasterGroup(models.Model):
    gid = models.CharField(max_length=10)
    name = models.CharField(max_length=10)
    descript = models.TextField(default='')
    image = models.ImageField(upload_to='master')

    def __str__(self):
        return f"{self.name}"


class Master(models.Model):
    master_id = models.CharField(max_length=10, primary_key=True)
#     group = models.ForeignKey(MasterGroup, on_delete=models.CASCADE)
    group = models.ManyToManyField(MasterGroup, related_name='groups', null=True)
    name = models.CharField(max_length=10)
    work_type = models.IntegerField(
        choices=[(1, '單'), (2, '雙')],
        default=1,
    )

    def __str__(self):
        return "{}".format(self.name)
             
class Reservation(models.Model):
   
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    master = models.ForeignKey(Master, on_delete=models.CASCADE)
    datetime = models.DateTimeField(verbose_name="reservation_time")
    name = models.CharField(max_length=10)
    phone = models.CharField(max_length=10)
    appointment_time = models.DateTimeField(default=None, blank=True, null=True, editable=False)
    has_sent_remind = models.BooleanField(default=False, verbose_name="系統已傳送提醒訊息")
    has_ensured_remind = models.BooleanField(default=False, verbose_name="客人已確認提醒")
    is_cancelled = models.BooleanField(default=False)
    cancel_time = models.DateTimeField(default=None, blank=True, null=True, editable=False)    
    event_id = models.CharField(max_length=50, editable=False)

    def __str__(self):
        return "{}_{}_{}_{}".format(self.id, self.master, datetime.strftime(self.datetime, '%Y%m%d%H%M'), self.name)
        
    def delete(self, *args, **kwargs):
        
        print("delete: " + self.event_id)
        
        super(Reservation, self).delete(*args, **kwargs)
        try:
            CM.delete_event(self.master.master_id, self.event_id)
        except:
            pass
        
#     def save(self, *args, **kwargs):
        
#         try:
#             event = CM.write_event(m_id=obj.master.master_id, start_time=obj.datetime, summary=obj.name + obj.phone) 
#             obj.event_id = event["id"]
#             obj.appointment_time = datetime.now()
#             obj.save()
#         except:
#             self.message_user(request, query.event_id + " 在Google Calendar 上新增失敗")
#             return              
        
#         try:
#         if self.is_cancelled == False:


        

#         print("AAAAAA")
#         reservation = Reservation.objects.get(master=self.master, datetime=self.datetime)
#         print(f"RRRRRR: {reservation}")
#             raise ValidationError('Duplicate Value', code='invalid')
#         except self.DoesNotExist:
            
#             event = CM.write_event(m_id=self.master.master_id, start_time=self.datetime, summary=self.name + self.phone) 
#             self.event_id = event["id"]
#             self.appointment_time = datetime.now()
#         super(Reservation, self).save(*args, **kwargs)
        
class Course(models.Model):

    title = models.CharField(max_length=10)
    image = models.ImageField(upload_to='course')
    brief_intro = models.CharField(max_length=50)
    detail = models.TextField(default='')
    
    def __str__(self):
        return f"{self.title}"
    
class Question(models.Model):
    
    key = models.CharField(max_length=10) 
    question = models.CharField(max_length=512)
    answer = models.TextField(default='', blank=True, null=True)
    answer_image = models.ImageField(upload_to='answer', blank=True, null=True)
    
    def __str__(self):
        return f"{self.key}_{self.question}_{self.answer}"
    
class OpeningDay(models.Model):
    
    days = models.IntegerField() 
    
    def __str__(self):
        return f"{self.days}"
        

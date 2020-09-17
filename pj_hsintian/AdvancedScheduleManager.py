# coding=UTF-8
# -*- coding: UTF-8 -*-

from apscheduler.schedulers.background import BackgroundScheduler
import time
from datetime import datetime, timedelta
import pytz

class AdvancedScheduleManager:
    
    def __init__(self, bot):
        
        self.s = BackgroundScheduler()
        self.s.start()
        self.bot = bot
        
        timez = pytz.timezone('Asia/Taipei')
        
        self.s.add_job(self.find_remindee_from_appointments, 'cron', day_of_week='mon-sun', hour=10, minute=0, timezone=timez)
        
    def find_remindee_from_appointments(self):
        
        self.bot.send_remind_message(days=3)
        
    def test_scheduler(self):
            
        self.s.add_job(self.bot.pprint, 'date', run_date=datetime.now() + timedelta(seconds=3), kwargs={"text":"Advanced schedule執行"}, id="test")
    
    def get_queue(self):
        
        return self.s.get_jobs()

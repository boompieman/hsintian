from __future__ import unicode_literals

import json

from http_client import HttpClient, RequestsHttpClient

from datetime import datetime, timedelta, timezone
import pytz
from test_app.models import Customer, Reservation, Master, MasterGroup, Course, Question
from test_app.google_calendar import CalendarManager
from django.db.models import Q
from redis_manager import RedisManager

from collections import defaultdict

redis_manager = RedisManager()

class HsintianApi(object):
    
    DEFAULT_API_ENDPOINT = 'https://hsintian.tk'
    
    
    def __init__(self, endpoint=DEFAULT_API_ENDPOINT,
                 timeout=HttpClient.DEFAULT_TIMEOUT, http_client=RequestsHttpClient):

        self.endpoint = endpoint
        self.headers = {
            'Content-Type': 'application/json'
        }

        if http_client:
            self.http_client = http_client(timeout=timeout)
        else:
            self.http_client = RequestsHttpClient(timeout=timeout)    
            
            
    def get_reservations(self, line_id, timeout=None):

        response = self._get(
            '/api/reservation/get?line_id={line_id}'.format(line_id=line_id),
            timeout=timeout
        )        

        return response.json
    
    def inner_get_reservation(self, line_id):
        
        tztaipei = timezone(timedelta(seconds=28800))
        
        now = datetime.now().astimezone(tztaipei)
        c = Customer.objects.get(line_id = line_id)
        r = Reservation.objects.filter(Q(customer = c) & Q(datetime__gte=now) & Q(is_cancelled=False))

        tztaipei = timezone(timedelta(seconds=28800))
        infos = []
        for item in r:
            infos.append({'master' : item.master.name,
                        'line_id' : item.customer.line_id, 
                        'datetime' : item.datetime.astimezone(tztaipei).strftime('%Y/%m/%d %H:%M'), 
                        'name' : item.name,
                        'phone' : item.phone,
                        'reservation_id' : item.id})


        result = {'status' : len(infos), #'reservation_numbers', 
                'infos' : infos}
        
        return result  
    
    def delete_reservation(self, reservation_id, timeout=None):
        
        response = self._delete(
            '/api/reservation/delete?reservation_id={reservation_id}'.format(reservation_id=reservation_id),
            timeout=timeout
        )
        
        return response.json
    
    def inner_delete_reservation(self, reservation_id):

        r = Reservation.objects.get(id=reservation_id)
        status = 'fail'
        except_type = ''
        error = ''
        
        tztaipei = timezone(timedelta(seconds=28800))
        now_time = datetime.now().astimezone(tztaipei)  
        
        if r.datetime.astimezone(tztaipei) > now_time + timedelta(hours=48):

            try :
                CM = CalendarManager()
                delete_result = CM.delete_event(r.master.master_id, r.event_id)
                Reservation.objects.filter(id=reservation_id).update(is_cancelled=True)
                Reservation.objects.filter(id=reservation_id).update(cancel_time=now_time) 

                reservation_datetime_str = datetime.strftime(r.datetime.astimezone(tztaipei), '%Y%m%d%H%M')
                
                print(r.master.master_id)
                
                if redis_manager.get_occupied_reservation(r.master.master_id, reservation_datetime_str):
                    redis_manager.delete_occupied_reservation(r.master.master_id, reservation_datetime_str)                             
                
                status = 'success'
            except Exception as e:
                status = 'failure'
                error = "此筆預約似乎已取消過囉！如有問題請與客服聯繫"
                except_type = "google calendar 無法刪除 event"
        else:
            
            error = '48小時內無法取消預約，請聯絡真人客服喔。'

        result = {'status' : status,
                'info' : {'master' : r.master.master_id, 
                        'line_id' : r.customer.line_id, 
                        'datetime' : r.datetime, 
                        'name' : r.name,
                        'phone' : r.phone,
                        'reservation_id' : r.id,
                        'exception' : except_type,
                        'error': error
                    }
                }

        return result
    
    def inner_get_remindees(self, days):
        
        tztaipei = timezone(timedelta(seconds=28800))
        
        now = datetime.now().astimezone(tztaipei)
        
        remind_day = now + timedelta(days=days)
        
        tztaipei = timezone(timedelta(seconds=28800))
        infos = []
        
        r_set = Reservation.objects.filter(Q(datetime__lte=remind_day) & Q(datetime__gte=now) & Q(has_sent_remind=False) & Q(is_cancelled=False))       
        
        distinct_reservation_dict = defaultdict(list)
               
        for item in r_set:
                
            distinct_reservation_dict[item.customer.line_id].append({

                'master' : item.master.name,
                'datetime' : item.datetime.astimezone(tztaipei).strftime('%Y/%m/%d %H:%M'), 
                'name' : item.name,
                'phone' : item.phone,
                'reservation_id' : item.id
            })

        for key, value in distinct_reservation_dict.items():
            
            infos.append({
                'line_id': key,
                'reservations': value
            })

        result = {'status' : len(infos), #'reservation_numbers', 
                'infos' : infos}

        return result
    
    def inner_update_remind_status(self, reservations):
        
        for reservation in reservations:  
            
            Reservation.objects.filter(pk=reservation["reservation_id"]).update(has_sent_remind=True)
            
    def inner_update_ensure_remind_status(self, reservation_id):
            
        Reservation.objects.filter(pk=reservation_id).update(has_ensured_remind=True)            
            
    def inner_get_courses(self):
        
        courses = Course.objects.all()
        
        return courses
    
    def inner_get_course(self, cid):
        
        course = Course.objects.get(id = cid)
        
        return course

    def inner_get_questions(self):
        
        questions = Question.objects.all()
        
        return questions
    
    def inner_get_question(self, key):
        
        question = Question.objects.filter(Q(key = key))
        
        return question    
    
    def _get(self, path, params=None, headers=None, stream=False, timeout=None):
        url = self.endpoint + path

        if headers is None:
            headers = {}
        headers.update(self.headers)

        response = self.http_client.get(
            url, headers=headers, params=params, stream=stream, timeout=timeout
        )

        return response

    def _post(self, path, data=None, headers=None, timeout=None):
        url = self.endpoint + path

        if headers is None:
            headers = {'Content-Type': 'application/json'}
        headers.update(self.headers)

        response = self.http_client.post(
            url, headers=headers, data=data, timeout=timeout
        )

        return response

    def _delete(self, path, data=None, headers=None, timeout=None):
        url = self.endpoint + path

        if headers is None:
            headers = {}
        headers.update(self.headers)

        response = self.http_client.delete(
            url, headers=headers, data=data, timeout=timeout
        )

        return response 
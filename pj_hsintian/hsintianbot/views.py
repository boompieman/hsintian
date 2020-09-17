from django.shortcuts import render

from django.conf import settings
from django.http import HttpRequest, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt

from linebot import (
    LineBotApi, WebhookHandler
)
from linebot.exceptions import (
    InvalidSignatureError
)

from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage,
    SourceUser, SourceGroup, SourceRoom,
    TemplateSendMessage, ConfirmTemplate, MessageAction,
    ButtonsTemplate, ImageCarouselTemplate, ImageCarouselColumn, URIAction,
    PostbackAction, DatetimePickerAction,
    CameraAction, CameraRollAction, LocationAction,
    CarouselTemplate, CarouselColumn, PostbackEvent,
    StickerMessage, StickerSendMessage, LocationMessage, LocationSendMessage,
    ImageMessage, VideoMessage, AudioMessage, FileMessage,
    UnfollowEvent, FollowEvent, JoinEvent, LeaveEvent, BeaconEvent,
    FlexSendMessage, BubbleContainer, ImageComponent, BoxComponent,
    TextComponent, SpacerComponent, IconComponent, ButtonComponent,
    SeparatorComponent, QuickReply, QuickReplyButton,
    RichMenu, RichMenuSize, RichMenuArea, RichMenuBounds
)

import json
import os

from MessageManager import MessageManager
from AdvancedScheduleManager import AdvancedScheduleManager
from redis_manager import RedisManager

with open("./sources/line_bot_token.json", 'r') as f:

    json_data = json.load(f)
    access_token = json_data["access_token"]
    channel_secret = json_data["channel_secret"]
    
line_bot_api = LineBotApi(access_token)
handler = WebhookHandler(channel_secret)

messageManager = MessageManager(line_bot_api)

# redisManager = RedisManager()

advancedScheduleManager = AdvancedScheduleManager(bot=messageManager)

@csrf_exempt
def callback(request: HttpRequest) -> HttpResponse:
    
    if request.method == "POST":
    # get X-Line-Signature header value

        signature = request.META['HTTP_X_LINE_SIGNATURE']

        # get request body as text
        body = request.body.decode('utf-8')
        
        print(body)

        # handle webhook body
        try:
            handler.handle(body, signature)

        except InvalidSignatureError:

            print("Invalid signature. Please check your channel access token/channel secret.")

            abort(400)

    return HttpResponse('OK')

@handler.add(FollowEvent)
def handle_follow(event):

    messageManager.send_greeting_message(event.reply_token)
    messageManager.link_rich_menu(event.source.user_id)

@handler.add(JoinEvent)
def handle_join(event):

    print("join")

@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    
    text = event.message.text.lower() 
    
#     if text != "常見問題" and redisManager.get_user_isAnswer(event.source.user_id):
        
#         if text == "0":

#             redisManager.delete_user_isAnswer(event.source.user_id)

#             return         
        
#         if text in num_list:
        
#             answer = "answer_" + text

#             messageManager.send_answer_message(reply_token = event.reply_token, postback_data = answer)

#             return
        
#         else:
            
#             messageManager.send_common_question_list_message(reply_token=event.reply_token)

    if text.isdigit():
        
        answer = "answer_" + text

        messageManager.send_answer_message(reply_token = event.reply_token, postback_data = answer)

        return        
            
    
    elif text == "get id":
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=event.source.user_id)
        )
    
    elif text == "test":
        
        advancedScheduleManager.test_scheduler()    
        
    elif text == "get queue":
        len_queue = advancedScheduleManager.get_queue()
        messageManager.pprint(reply_token=event.reply_token , text=str(len_queue))
        
    elif text == "remind":
        messageManager.send_remind_message(3)
        
#     elif text == "查詢預約" or text == "常見問題" or text == "查看預約" or text == "課程介紹" or text == "結束提問":
#         pass
    
#     else:
#         messageManager.send_greeting_message(event.reply_token)
    

@handler.add(PostbackEvent)
def handle_postback(event):
    
    if event.postback.data == "check_reservation":
        messageManager.send_check_reservation_message(line_id=event.source.user_id, reply_token=event.reply_token)
        
    elif "first_cancel_reservation" in event.postback.data:

        messageManager.send_will_cancel_reservation_message(reply_token=event.reply_token, postback_data=event.postback.data)
        
    elif "ensure_cancel_reservation" in event.postback.data:
        
        messageManager.send_cancelled_reservation_message(reply_token=event.reply_token, postback_data=event.postback.data)
        
    elif "ensure_remind_reservation" in event.postback.data:
        
        messageManager.send_ensured_remind_message(reply_token=event.reply_token, postback_data=event.postback.data)
        
    elif "common_questions" in event.postback.data:
        
#         redisManager.set_user_isAnswer(event.source.user_id)
        
        messageManager.send_common_question_list_message(reply_token=event.reply_token)

    elif "introduce_course" in event.postback.data:
        
        messageManager.send_course_introduction_message(reply_token=event.reply_token)
        
    elif "check_course_detail" in event.postback.data:
        
        messageManager.send_course_detail_message(reply_token=event.reply_token, postback_data = event.postback.data)
        
    elif event.postback.data == "end_QA":
        
        messageManager.send_end_QA_message(reply_token=event.reply_token)
        
#         redisManager.delete_user_isAnswer(event.source.user_id)
    
#     elif "answer" in event.postback.data:
        
#         messageManager.send_answer_message(reply_token = event.reply_token, postback_data = event.postback.data)
    
@handler.add(MessageEvent, message=(ImageMessage, VideoMessage))
def handle_content_message(event):
    print("content")

    
@csrf_exempt
def generate_rich_menu(request: HttpRequest) -> HttpResponse:
    
    rich_menu = RichMenu(
        size=RichMenuSize(width=2500, height=1686),
        selected=False,
        name="Nice richmenu",
        chat_bar_text="點擊選單",
        areas=[
            RichMenuArea(
                bounds=RichMenuBounds(x=0, y=0, width=833, height=843),
                action=URIAction(
                    label='我要預約',
                    uri='https://liff.line.me/1654335010-n02repwV',
                )
            ),
            RichMenuArea(
                bounds=RichMenuBounds(x=0, y=843, width=833, height=843),
                action=PostbackAction(
                    label='查詢預約',
                    text='查詢預約',
                    data='check_reservation',
                )
            ),
            RichMenuArea(
                bounds=RichMenuBounds(x=833, y=843, width=833, height=843),
                action=PostbackAction(
                    label='課程介紹',
                    text='課程介紹',
                    data='introduce_course',
                )
            ),
            RichMenuArea(
                bounds=RichMenuBounds(x=1666, y=843, width=833, height=843),
                action=PostbackAction(
                    label='常見問題',
                    text='常見問題',
                    data='common_questions',
                )
            ),
            RichMenuArea(
                bounds=RichMenuBounds(x=1666, y=0, width=833, height=843),
                action=URIAction(
                    label='諮詢客服',
                    uri='http://line.me/ti/p/@t0927899899'
                )
            )                       
        ]
    )    

    
    rich_menu_id = line_bot_api.create_rich_menu(rich_menu)
    
    with open('/home/hsintian/linebot/rich_menu.png', 'rb') as f:
        line_bot_api.set_rich_menu_image(rich_menu_id, 'image/png', f)    
    
    return HttpResponse("<h1 style='color:blue'>rich_menu: " + rich_menu_id + "</h1>")
    
@csrf_exempt    
def send_new_reservation(request: HttpRequest) -> HttpResponse:
    
    if request.method =="POST" :
        status = "POST"
        
    line_id = request.POST.get('line_id', 'default_lineid')
    reservation_id = request.POST.get('reservation_id', 'default_reservation_id')
    name = request.POST.get('name', 'default_name')
    reservation_datetime = request.POST.get('datetime', 'default_datetime')
    master = request.POST.get('master', 'default_master')    
    
    messageManager.send_new_reservation(
        line_id=line_id, 
        reservation_id=reservation_id, 
        name=name, 
        master=master, 
        reservation_datetime=reservation_datetime
    )
    
    return HttpResponse("ok")
    
@csrf_exempt    
def send_failure_reservation_message(request: HttpRequest) -> HttpResponse:
    
    if request.method =="POST" :
        status = "POST"
        
    line_id = request.POST.get('line_id', 'default_lineid')
    error_code = request.POST.get('error_code', 'error_code')
    
    messageManager.send_failure_reservation_message(
        line_id=line_id, 
        error_code = error_code
    )
    
#     messageManager.send_new_reservation(
#         line_id=line_id, 
#         reservation_id=reservation_id, 
#         name=name, 
#         master=master, 
#         reservation_datetime=reservation_datetime
#     )
    
    return HttpResponse("ok")    
    
    
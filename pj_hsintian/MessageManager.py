# -*- coding: UTF-8 -*-

from linebot import (
    LineBotApi
)

from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage,
    SourceUser, SourceGroup, SourceRoom,
    TemplateSendMessage, ConfirmTemplate, MessageAction,
    ButtonsTemplate, ImageCarouselTemplate, ImageCarouselColumn, URIAction,
    PostbackAction, DatetimePickerAction,
    CameraAction, CameraRollAction, LocationAction, MessageImagemapAction,
    CarouselTemplate, CarouselColumn, PostbackEvent,
    StickerMessage, StickerSendMessage, LocationMessage, LocationSendMessage,
    ImageMessage, VideoMessage, AudioMessage, FileMessage, ImageSendMessage, ImagemapSendMessage, BaseSize, ImagemapArea,
    UnfollowEvent, FollowEvent, JoinEvent, LeaveEvent, BeaconEvent,
    FlexSendMessage, BubbleContainer, ImageComponent, BoxComponent,
    TextComponent, SpacerComponent, IconComponent, ButtonComponent,
    SeparatorComponent, CarouselContainer, QuickReply, QuickReplyButton, VideoSendMessage,
    URITemplateAction
)

from api import HsintianApi

DEFAULT_RICHMENU_ID = "richmenu-29dd3dc4627b8c1646d6ed9b51b16355"

import json

apiManager = HsintianApi()

class MessageManager:
    
    def __init__(self, line_bot_api):
        
        self.line_bot_api = line_bot_api

    def link_rich_menu(self,user_id):
        self.line_bot_api.link_rich_menu_to_user(user_id, DEFAULT_RICHMENU_ID)
        
    def get_rich_menu(self,user_id):
        print(self.line_bot_api.get_rich_menu_id_of_user(user_id))
        for rich_menu in self.line_bot_api.get_rich_menu_list():
            if rich_menu.rich_menu_id != DEFAULT_RICHMENU_ID:
                self.line_bot_api.delete_rich_menu(rich_menu.rich_menu_id)
            print(rich_menu.rich_menu_id)
        
        
    def send_greeting_message(self, reply_token):
        
        newcoming_text = "歡迎使用馨田線上預約系統，您可以在選單找到需要的訊息，如預約系統無法回覆您的問題，歡迎聯繫客服諮詢唷"  
        
        buttons_template = ButtonsTemplate(
            title="您好，我是馨田的智能小幫手！", text=newcoming_text, actions=[

                URIAction(label='我要預約',uri='https://liff.line.me/1654335010-n02repwV'),
                PostbackAction(label='查詢預約', text='查詢預約', data='check_reservation'),
                URIAction(label='聯絡客服', uri="http://line.me/ti/p/@t0927899899"),
                PostbackAction(label='常見問題', text='常見問題', data='common_questions'), 
            ])

        template_message = TemplateSendMessage(
            alt_text=newcoming_text, template=buttons_template)
        
        image_message = ImageSendMessage("https://hsintian.tk/static/welcome_image.jpg", "https://hsintian.tk/static/welcome_image.jpg")
        
        self.line_bot_api.reply_message(reply_token, [template_message,image_message])
        
    def send_remind_message(self, days):
        
        reservations_info = apiManager.inner_get_remindees(days)["infos"]
        
        for info in reservations_info:
            
            if info["reservations"] and info["line_id"]:
                
                reservation_message = self._generate_reservation_message(info["reservations"], is_remind_message=True)
        
                self.line_bot_api.push_message(info['line_id'], messages=reservation_message)
        
                apiManager.inner_update_remind_status(info["reservations"])
            
    def send_common_question_list_message(self, reply_token):
        
        questions = apiManager.inner_get_questions()
        
        str_questions = ""
        
        for question in questions:
            
            question_item = f"{question.key}. {question.question}"
            
            str_questions += f"{question_item}\n"
        
        bubble = BubbleContainer(
            direction='ltr',
            size="giga",         
            body=BoxComponent(
                layout='vertical',
                contents=[
                    TextComponent(f'請輸入數字代碼，馨田機器人會回答好您的問題：\n{str_questions}\n\n如有緊急狀況需立刻預約調理，請您聯繫客服諮詢', size='lg', color='#333333', margin='lg',wrap=True),
                ],
            ),
            footer=BoxComponent(
                layout='horizontal',
                contents=[
                    SpacerComponent(size='sm'),
                    ButtonComponent(
                        style='primary',
                        height='sm',
                        action=URIAction(label='聯絡客服', uri="http://line.me/ti/p/@t0927899899")
                    ),
                ]
            ),
        )
        
        message = FlexSendMessage(alt_text="我要問問題", contents=CarouselContainer([bubble]))
             
        self.line_bot_api.reply_message(reply_token, message)
        
    def send_end_QA_message(self, reply_token):
    
        text_message = TextMessage(
            text = '感謝您的提問，歡迎有問題再次詢問喔！'
        )
        
             
        self.line_bot_api.reply_message(reply_token, text_message)
        
    def send_answer_message(self, reply_token, postback_data):
        
#         answer_list = {
            
#             "1":"圖文選單",
#             "2":"週二到週六，9:00-21:00\n週日老師較少採顧客預約輪班\n(客服忙碌時無法及時回覆，請多多包涵☻)",
#             "3":"圖片二",
#             "4":"因為每位客戶來身體狀況皆不同，本公司會視情況安排1-2位專業老師檢查身體與調理，首次來的客戶會再講解姿勢+運動指導",
#             "5":"為了提供更好的服務品質💪\n本店2020年2月開始從人工預約升級為『線上預約系統』\n讓顧客自行挑選理想時間❤️\n\n如長輩或不會使用者需要協助預約，請聯繫客服或者致電：（02）2563-3468。",
#             "6":"台北市中山區民生西路45巷5弄8號\n（雙連捷運站2號出口，走路2分鐘）",
#             "7":"1. 懷孕中的媽媽\n2. 月經量大不適、血崩經驗\n3. 動手術開完刀6個月內\n4. 骨質密度3以上不可調理\n5. 嚴重慢性病者須出示證明\n6. 嚴重心血管疾病不可調理\n7. 骨頭(脊椎)有碎有裂不可調理",
#             "8":"不可以調理唷！如果孕期痠痛可以搭配伸展，我們期待產後再為您服務。",
#             "9":"自然產：1個月\n剖腹產：1個半月\n（趴著傷口不會痛為準）",
#             "10":"本店無提供指定老師，每一位老師的手法和技術都相同，包含櫃檯人員在內都是護理大學與相關科系畢業，在專業上請您放心預約！",
#         }
        
        question_answer = apiManager.inner_get_question(postback_data.split("_")[1])
        
        if postback_data.split("_")[1] == "1":
            
            message = self._generate_course_overview_message()
        
            self.line_bot_api.reply_message(reply_token, message)
        
#         elif postback_data.split("_")[1] == "3":
            
#             image_message = ImageSendMessage(f"https://hsintian.tk/static/images/{question_answer[0].answer_image}#1", f"https://hsintian.tk/static/images/{question_answer[0].answer_image}#1")

#             self.line_bot_api.reply_message(reply_token, image_message)
        
#         elif postback_data.split("_")[1] == "6":
            
#             text_message = TextMessage(text = question_answer[0].answer)
            
#             image_message = ImageSendMessage("https://hsintian.tk/static/welcome_image.jpg", "https://hsintian.tk/static/welcome_image.jpg")

#             self.line_bot_api.reply_message(reply_token, [text_message,image_message])            
            
        else:
            
            messages = []
            
            if question_answer[0].answer:
                
                text_message = TextMessage(text= question_answer[0].answer)
                
                messages.append(text_message)
                
            if question_answer[0].answer_image:
                
                image_message = ImageSendMessage(
                    f"https://hsintian.tk/static/images/{question_answer[0].answer_image}#1",
                    f"https://hsintian.tk/static/images/{question_answer[0].answer_image}#1"
                )    
                
                messages.append(image_message)
        
            self.line_bot_api.reply_message(reply_token, messages)
        
    def pprint(self, text, reply_token=None):
        
        text_message = TextMessage(text=text)
        
        if reply_token:
            self.line_bot_api.reply_message(reply_token, messages=text_message)
            
        else:
            self.line_bot_api.push_message("U0b59b820c808e938e9bf6c8c479093b3", messages=text_message)
            
    def send_check_reservation_message(self, line_id, reply_token):

        # call api
        reservations = apiManager.inner_get_reservation(line_id)["infos"]
        
        if reservations:
      
            reservation_message = self._generate_reservation_message(reservations)
        
        else:
            
            buttons_template = ButtonsTemplate(
                title="您目前沒有任何預約喔！", text="歡迎點擊按鈕預約", actions=[

                    URIAction(label='我要預約',uri='line://app/1613607650-0mBQXARw'),
                ])

            reservation_message = TemplateSendMessage(alt_text="我要預約", template=buttons_template)
        
        self.line_bot_api.reply_message(reply_token, messages=reservation_message)
        
    def send_will_cancel_reservation_message(self, reply_token, postback_data):
        
        reservation_id = postback_data.split("-")[1]
        
        reservation_time = postback_data.split("-")[2]
        
        buttons_template = ButtonsTemplate(
            title="預約取消確認 - " + reservation_time, text="請問你真的要取消 " + reservation_time + " 的預約嗎", actions=[

                PostbackAction(label='確定',data='ensure_cancel_reservation-' + reservation_id + "-" + reservation_time),
            ])

        template_message = TemplateSendMessage(
            alt_text="取消預約確認", template=buttons_template)
        
        self.line_bot_api.reply_message(reply_token, template_message)
        
    def send_cancelled_reservation_message(self, reply_token, postback_data):
        
        # call cancel reservation api
        
        reservation_id = postback_data.split("-")[1]
        
        reservation_time = postback_data.split("-")[2]
        
        response = apiManager.inner_delete_reservation(reservation_id)
        
        if response['status'] == 'success':
        
            text = "已經幫您取消" + reservation_time +" 的預約, 感謝您的支持"
        
            text_message = TextMessage(text=text)
        
            self.line_bot_api.reply_message(reply_token, messages=text_message)
        
        else:
            
            bubble = BubbleContainer(
                direction='ltr',
                size="giga",         
                body=BoxComponent(
                    layout='vertical',
                    contents=[
                        TextComponent(text=response['info']['error'], size='lg', color='#333333', margin='lg',wrap=True),
                    ],
                ),
                footer=BoxComponent(
                    layout='horizontal',
                    contents=[
                        SpacerComponent(size='sm'),
                        ButtonComponent(
                            style='primary',
                            height='sm',
                            action=URIAction(label='聯絡客服',uri='http://line.me/ti/p/@t0927899899'),
                        ),
                    ]
                ),
            )

            message = FlexSendMessage(alt_text="無法取消預約", contents=CarouselContainer([bubble]))
        
            self.line_bot_api.reply_message(reply_token, messages=message)            

    def send_ensured_remind_message(self, reply_token, postback_data):
        
        reservation_id = postback_data.split("-")[1]
        
        reservation_time = postback_data.split("-")[2]
        
        response = apiManager.inner_update_ensure_remind_status(reservation_id)        
        
        text_message = TextMessage(
            text = '感謝您的確認，期待到時看到您喔！'
        )
        
        
        self.line_bot_api.reply_message(reply_token, messages=text_message)                    
    
    def send_new_reservation(self, line_id, reservation_id, name, master, reservation_datetime):
        
        reservations = [{"reservation_id": reservation_id, "name":name, "datetime": reservation_datetime, "master": master}]
        
        reservation_message = self._generate_reservation_message(reservations)
        
        self.line_bot_api.push_message(line_id, messages=reservation_message)
        
    def send_course_introduction_message(self, reply_token):
        
        message = self._generate_course_overview_message()

        self.line_bot_api.reply_message(reply_token, message)
        
    def send_course_detail_message(self, reply_token, postback_data):
        
        course_num = postback_data.split("_")[-1]
        
        message = self._generate_course_detail_message(course_num)
        
        self.line_bot_api.reply_message(reply_token, message)
        
    def _generate_course_detail_message(self, course_num):

        course = apiManager.inner_get_course(course_num) 
        
        bubble = BubbleContainer(
            direction='ltr',
            size="giga",         
            body=BoxComponent(
                layout='vertical',
                contents=[
                    TextComponent(text=course.detail, size='sm', color='#333333', margin='lg',wrap=True),
                ],
            ),
            footer=BoxComponent(
                layout='horizontal',
                contents=[
                    SpacerComponent(size='sm'),
                    ButtonComponent(
                        style='primary',
                        height='sm',
                        action=URIAction(label='請洽客服諮詢',uri='http://line.me/ti/p/@t0927899899'),
                    ),
                ]
            ),
        )
        
        message = FlexSendMessage(alt_text="課程介紹", contents=CarouselContainer([bubble]))
        
        return message
        
    def _generate_course_overview_message(self):
        
        courses = apiManager.inner_get_courses()
        
        bubbles = []
        
        for course in courses:
            
            bubble = BubbleContainer(
                direction='ltr',
                size="giga",
                hero=ImageComponent(
                    url=f'https://hsintian.tk/static/images/{course.image}#1',
                    size='full',
                    aspect_ratio='1:1',
                    aspect_mode='cover',
                ),                
                body=BoxComponent(
                    layout='vertical',
                    contents=[
                        # title
                        TextComponent(text=course.title, weight='bold', size='md', color='#333333', margin='lg'),
                        TextComponent(text=course.brief_intro, size='sm', color='#333333', margin='lg', wrap=True),
                    ],
                ),
                footer=BoxComponent(
                    layout='horizontal',
                    contents=[
                        # callAction, separator, websiteAction
                        SpacerComponent(size='sm'),
                        # callAction
                        ButtonComponent(
                            style='primary',
                            height='sm',
                            action=PostbackAction(label='查看詳情', data=f'check_course_detail_{course.id}')
                        ),
                    ]
                ),
            )
            
            bubbles.append(bubble)  
        
        message = FlexSendMessage(alt_text="課程介紹", contents=CarouselContainer(bubbles))
        
        return message
        
    def _generate_reservation_message(self, reservations, is_remind_message=False):
        
        reservation_bubbles = []
        
        for reservation in reservations:
            
            if is_remind_message:               
                
                action= PostbackAction(
                    label='確認預約',
                    data=f'ensure_remind_reservation-{str(reservation["reservation_id"])}-{str(reservation["datetime"])}'
                )

            else:
                action = URIAction(
                    label='聯絡客服',
                    uri="http://line.me/ti/p/@t0927899899" 
                )            
        
            bubble = BubbleContainer(
                direction='ltr',
                hero=ImageComponent(
                    url='https://hsintian.tk/static/banner.jpg#1',
                    size='full',
                    aspect_ratio='2.874:1',
                    aspect_mode='cover',
                ),                
                body=BoxComponent(
                    layout='vertical',
                    contents=[
                        # title
                        TextComponent(text='Reservation', weight='bold', size='md', color='#40653E', margin='lg'),
                        BoxComponent(
                            layout='baseline',
                            spacing='sm',
                            margin='xxl',
                            contents=[
                                TextComponent(
                                    text='預約人姓名',
                                    color='#aaaaaa',
                                    size='md',
                                    flex=4
                                ),
                                TextComponent(
                                    text= reservation["name"],
                                    wrap=True,
                                    color='#666666',
                                    size='md',
                                    flex=6
                                )
                            ],
                        ),                        
                        BoxComponent(
                            layout='baseline',
                            spacing='sm',
                            margin='lg',
                            contents=[
                                TextComponent(
                                    text='預定時間',
                                    color='#aaaaaa',
                                    size='md',
                                    flex=4
                                ),
                                TextComponent(
                                    text= reservation["datetime"],
                                    wrap=True,
                                    color='#666666',
                                    size='md',
                                    flex=6
                                )
                            ],
                        ),
                        BoxComponent(
                            layout='baseline',
                            spacing='sm',
                            margin='lg',
                            contents=[
                                TextComponent(
                                    text='預約床位',
                                    color='#aaaaaa',
                                    size='md',
                                    flex=4
                                ),
                                TextComponent(
                                    text= reservation["master"],
                                    wrap=True,
                                    color='#666666',
                                    size='md',
                                    flex=6
                                )
                            ],
                        ),                        
                        # info
                        BoxComponent(
                            layout='vertical',
                            margin='lg',
                            spacing='sm',
                            contents=[
                                BoxComponent(
                                    layout='baseline',
                                    spacing='sm',
                                    contents=[
                                        TextComponent(
                                            text='地點',
                                            color='#aaaaaa',
                                            size='md',
                                            flex=4
                                        ),
                                        TextComponent(
                                            text='台北市中山區民生西路45巷5弄8號',
                                            wrap=True,
                                            color='#666666',
                                            size='md',
                                            flex=6
                                        )
                                    ],
                                ),
                            ],
                        ),
                        BoxComponent(
                            layout='vertical',
                            margin='lg',
                            spacing='sm',
                            contents=[
                                BoxComponent(
                                    layout='baseline',
                                    spacing='sm',
                                    contents=[
                                        TextComponent(
                                            text='附註１：為了使課程時間以及流程更加順暢，馨田保留在評估客人之後，現場調度服務老師的權利，且課程也會由一至二位老師共同完成，敬請見諒。',
                                            wrap=True,
                                            color='#4F4F4F',
                                            size='sm',
                                            flex=10
                                        ),                                    
                                    ],
                                ),
                            ],
                        ),                        
                        BoxComponent(
                            layout='vertical',
                            margin='lg',
                            spacing='sm',
                            contents=[
                                BoxComponent(
                                    layout='baseline',
                                    spacing='sm',
                                    contents=[
                                        TextComponent(
                                            text='附註２：預約在服務前48小時內無法取消，如有問題請洽客服',
                                            wrap=True,
                                            color='#aaaaaa',
                                            size='sm',
                                            flex=10
                                        ),                                    
                                    ],
                                ),
                            ],
                        ),
                        BoxComponent(
                            layout='vertical',
                            margin='lg',
                            spacing='sm',
                            contents=[
                                BoxComponent(
                                    layout='baseline',
                                    spacing='sm',
                                    contents=[
                                        TextComponent(
                                            text='附註３：如超過兩次未依系統規定取消卻未到，將無法使用線上預約服務，如有疑問，請聯繫客服',
                                            wrap=True,
                                            color='#aaaaaa',
                                            size='sm',
                                            flex=10
                                        ),                                    
                                    ],
                                ),
                            ],
                        ),                          
                    ],
                ),
                footer=BoxComponent(
                    layout='horizontal',
                    contents=[
                        # callAction, separator, websiteAction
                        SpacerComponent(size='sm'),
                        # callAction
                        
                        ButtonComponent(
                            style='primary',
                            height='sm',
                            color='#DD8464',
                            action=action
                        ),                        
                        
                        ButtonComponent(
                            style='primary',
                            height='sm',
                            margin='lg',                            
                            color="#8E9881",
                            action=PostbackAction(
                                label='取消預約',
                                data='ensure_cancel_reservation-' + str(reservation["reservation_id"]) + "-" + str(reservation["datetime"])),
                        )
                        
                        # if we want get the user info, we need to call an api to our server then redirect to line.me uri.
                    ]
                ),
            )
            
            reservation_bubbles.append(bubble)
        
        message = FlexSendMessage(alt_text="預約回報", contents=CarouselContainer(reservation_bubbles))
        
        return message
    
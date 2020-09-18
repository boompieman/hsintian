const flex = { 
    "altText": "新的預約成立了",
    "contents": { 
       "contents": [ 
            { 
                "body": { 
                    "contents": [ 
                        { 
                        "color":"#40653E",
                        "margin":"lg",
                        "size":"md",
                        "text":"Reservation",
                        "type":"text",
                        "weight":"bold"
                        },
                        { 
                            "contents": [ 
                                { 
                                    "color":"#aaaaaa",
                                    "flex":4,
                                    "size":"md",
                                    "text":"預約人姓名",
                                    "type":"text"
                                },
                                { 
                                    "color":"#666666",
                                    "flex":6,
                                    "size":"md",
                                    "text":"{{reservation['name']}}",
                                    "type":"text",
                                    "wrap":true
                                }
                            ],
                            "layout":"baseline",
                            "margin":"xxl",
                            "spacing":"sm",
                            "type":"box"
                        },
                        { 
                            "contents": [ 
                                { 
                                    "color":"#aaaaaa",
                                    "flex":4,
                                    "size":"md",
                                    "text":"預定時間",
                                    "type":"text"
                                },
                                { 
                                    "color":"#666666",
                                    "flex":6,
                                    "size":"md",
                                    "text":"{{reservation['datetime']}}",
                                    "type":"text",
                                    "wrap":true
                                }
                            ],
                            "layout":"baseline",
                            "margin":"lg",
                            "spacing":"sm",
                            "type":"box"
                        },
                        { 
                            "contents": [ 
                                { 
                                    "contents":[ 
                                        { 
                                            "color":"#aaaaaa",
                                            "flex":4,
                                            "size":"sm",
                                            "text":"地點",
                                            "type":"text"
                                        },
                                        { 
                                            "color":"#666666",
                                            "flex":6,
                                            "size":"sm",
                                            "text":"台北市中山區民生西路45巷5弄5號",
                                            "type":"text",
                                            "wrap":true
                                        }
                                    ],
                                    "layout":"baseline",
                                    "spacing":"sm",
                                    "type":"box"
                                }
                            ],
                            "layout": "vertical",
                            "margin": "lg",
                            "spacing": "sm",
                            "type": "box"
                        }
                    ],
                    "layout": "vertical",
                    "type": "box"
                },
                "direction": "ltr",


                "footer": {
                    "layout":"vertical",
                    "type":"box",
                    "contents":[ 
                        { 
                            "size":"sm",
                            "type":"spacer"
                        },
                        { 
                            "color":"#aaaaaa",
                            "flex":10,
                            "size":"md",
                            "text":"PS. 若要取消預約，請點擊查詢預約後取消。",
                        }
                    ],
                },

                "type":"bubble"
            }
        ],
        "type":"carousel"
    },
    "type":"flex"
}

export default flex;
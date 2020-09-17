import redis

class RedisManager:

    def __init__(self):
        pool = redis.ConnectionPool(host='127.0.0.1', port=6379, decode_responses=True)
        self.r = redis.Redis(connection_pool=pool)
    
    def set_user_isAnswer(self, source_user):
        
        user_redis_key = "isAnswer_{source_user}".format(source_user=source_user)
        
        self.r.set(user_redis_key, 1)

    def delete_user_isAnswer(self, source_user):

        user_redis_key = "isAnswer_{source_user}".format(source_user=source_user)

        self.r.delete(user_redis_key)

    def get_user_isAnswer(self, source_user):

        user_redis_key = "isAnswer_{source_user}".format(source_user=source_user)

        return self.r.get(user_redis_key)
    
    def set_occupied_reservation(self, master_id, datetime):
        
        key = f"{master_id}_{datetime}"
        
        print(key)
        
        self.r.set(key, 1)
        
    def get_occupied_reservation(self, master_id, datetime):
        
        key = f"{master_id}_{datetime}"
        
        return self.r.get(key)
    
    def delete_occupied_reservation(self, master_id, datetime):
        
        key = f"{master_id}_{datetime}"
        
        self.r.delete(key)
    





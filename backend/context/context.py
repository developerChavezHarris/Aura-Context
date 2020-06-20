context = []

class UpdateContext:
    def __init__(self, response):
        self.response = response

    def update_context(self):
        global context
        context.append(self.response)

class GetContext:
    def get_context(self):
        global context
        sorted_context = sorted(context, key = lambda i: i['time_stamp'], reverse=True)
        return sorted_context

class GetLastIntent:
    def __init__(self, context):
        self.context = context

    def get_last_intent(self):
        if len(self.context) > 0:
            last_intent = str(self.context[0]['intent'])
            return str(last_intent)
        else:
            pass

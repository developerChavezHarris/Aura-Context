context = []



class Context:
    def __init__(self, utterance):
        self.utterance = utterance


    def get_context(self):
        global context
        context.append(self.utterance)
        new_context = sorted(context, key = lambda i: i['time_stamp'], reverse=True)
        return new_context
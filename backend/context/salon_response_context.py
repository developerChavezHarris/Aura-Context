from collections import Counter
response_context = []
slots_context = []
response = ''


class ConversationContext:
    def __init__(self, current_intent, last_intent, response):
        self.current_intent = current_intent
        self.last_intent = last_intent
        self.response = response

    def maintain_context(self):
        if self.last_intent == 'ask_about_service' and self.current_intent == 'yes':
            global response_context
            global slots_context
            global response
            response_context_sorted = sorted(response_context, key = lambda i: i['time_stamp'], reverse=True)
            # print(sorted_response)
            # if len(self.response['slots']) > 0:
            self.response['slots'] = response_context_sorted[1]['slots']
            self.response['intent'] = 'book_appointments'
            update_response(self.response)
            new_response = removeDuplicateSlots()
            return new_response
            

        if self.current_intent == 'book_appointments_update' or 'book_appointments':
            if len(self.response['slots']) > 0:
                slots_in_response = self.response['slots'][0]
                slots_context.append(slots_in_response)
                update_response(self.response)
                new_response = removeDuplicateSlots()
                return new_response
        else:
            pass

# To move into its own separate files

class UpdateResponseContext:
    def __init__(self, response):
        self.response = response

    def update_response_context(self):
        global response_context
        response_context.append(self.response)
        # print(response)
        return response_context


class GetResponse:
    def get_response(self):
        global response_context
        return response_context


class ClearContext:
    def clear_context(self):
        global slots_context
        slots_context = []
        return slots_context


def removeDuplicateSlots():
    global response
    # Remove duplicate values
    global slots_context
    l = slots_context
    if len(l) > 0:
        vals = sorted(l, key = lambda i: i['value'], reverse=True)
        k = [x['slot'] for x in vals]
        no_duplicate_slots=[]
        for i in Counter(k):
            all = [x for x in vals if x['slot']==i]
            no_duplicate_slots.append(max(all, key=lambda x: x['value']))   
        response['slots'] = no_duplicate_slots
        return no_duplicate_slots


def get_response():
    global response
    return response


def update_response(new_response):
    global response
    response = new_response
    return new_response

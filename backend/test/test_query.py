# Core imports
import os
import time
from datetime import datetime

# Model imports

from process.utterance import CollectUtterance, RemovePunctuation, Classification
from process.character import RemoveRepeatedChars
from process.word import LemmatizeWords, CheckSpelling, StopWords, Svps
from context.context import Context

from ai_core import config

# Model Specific
base_dir = config.base_dir
clf_model_dir = config.clf_model_dir
clf_model_root_intents_json_file = config.clf_model_root_intents_json_file
root_clf_model_vectorizer = config.root_clf_model_vectorizer
root_clf_model = config.root_clf_model
update_clf_model_dir = config.update_clf_model_dir
svp_model_dir = config.svp_model_dir
svp_model_dir_core = config.svp_model_dir_core
svp_model_json_file = config.svp_model_json_file

wipe_clf_model_path = config.wipe_clf_model_path
wipe_svp_model_path = config.wipe_svp_model_path

last_intent = ''

def update_last_intent(new_value):
    global last_intent
    last_intent = new_value
    return last_intent

def get_last_intent():
    global last_intent
    return last_intent



class TestQuery:
    def __init__(self, utterance):
        self.utterance = utterance    

    def test_query(self):
        # try:

        response = ""

        intent_svp_path = ""
        # validate utterance
        # ---->>>> code here
        # if len(self.utterance) > 150:
        #     raise Exception 

        # Remove punctuation from utterance and create a list of words
        utterance = (RemovePunctuation(self.utterance).remove_punctuation())

        utterance = ''.join(utterance)

        # get last intent
        the_last_intent = get_last_intent()
        print(the_last_intent, '<<< Last Intent')

        # based on the previous intent, we determine how we classify the next

        # check if there is an update classification for the previous intent



        # Classify utterance

        update_intent_looks_like = the_last_intent+'_update'

        # check if a clf model exists in update_intents dircetory

        path_to_look_for = os.path.join(update_clf_model_dir, update_intent_looks_like)

        if os.path.exists(path_to_look_for):
            update_intent_vectorizer = os.path.join(path_to_look_for, update_intent_looks_like+'.pickle') 
            update_intent_model = os.path.join(path_to_look_for, update_intent_looks_like+'.model')
            intent = Classification(utterance, update_intent_vectorizer, update_intent_model).classify_intent()

        elif 'update' in the_last_intent:
            update_path_to_look_for = os.path.join(update_clf_model_dir, the_last_intent)
            if os.path.exists(update_path_to_look_for):
                try:
                    update_intent_vectorizer = os.path.join(update_path_to_look_for, the_last_intent+'.pickle') 
                    update_intent_model = os.path.join(update_path_to_look_for, the_last_intent+'.model')
                    intent = Classification(utterance, update_intent_vectorizer, update_intent_model).classify_intent()
                except:
                    intent = Classification(utterance, root_clf_model_vectorizer, root_clf_model).classify_intent()



        else:
            intent = Classification(utterance, root_clf_model_vectorizer, root_clf_model).classify_intent()

        

        print(intent, '<<< Current Intent')
        if intent == 'none':
            intent = Classification(utterance, root_clf_model_vectorizer, root_clf_model).classify_intent()

        if intent == 'start_over':
            intent = Classification(utterance, root_clf_model_vectorizer, root_clf_model).classify_intent()

        #  Remove repeated characters
        utterance = (RemoveRepeatedChars(utterance).remove_repeated_chars())

        utterance = ''.join(utterance)

        # Look for synonyms
        # words = csv_word_replacer(words, 'synonyms.csv')

        # Get ner data from utterance
        # Path to look 

        # Get time stamp
        now = datetime.now()
        time_stamp = datetime.timestamp(now)
        time_formated = time.ctime()

        time_dict = {
            "time_stamp": time_stamp,
            "time_format": time_formated,
        }

        if os.path.exists(os.path.join(svp_model_dir, intent)):
            intent_svp_path = os.path.join(svp_model_dir, intent)
            svps = Svps(utterance, intent_svp_path).extract_svps()
            if len(svps) > 0:
                response = {
                    "time_stamp": time_stamp,
                    "time": time_dict,
                    "utterance": utterance,
                    "intent": intent,
                    "slots": svps,
                }
                context = Context(response).get_context()
                if len(context) > 0:
                    temp_last_intent = str(context[0]['intent'])
                    update_last_intent(temp_last_intent)

                else:
                    pass
        else:
            response = {
            "time_stamp": time_stamp,
            "time": time_dict,
            "utterance": utterance,
            "intent": intent,
            "slots": []
        }
            context = Context(response).get_context()
            if len(context) > 0:
                    temp_last_intent = str(context[0]['intent'])
                    update_last_intent(temp_last_intent)
            else:
                pass  


        print(response)

        return response   
            
    # except:
    #     user_message = 'Error testing bot'
    #     print(user_message)
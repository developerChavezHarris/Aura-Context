# Core imports
import os

# Model imports

from process.utterance import CollectUtterance, RemovePunctuation, Classification
from process.character import RemoveRepeatedChars
from process.word import LemmatizeWords, CheckSpelling, StopWords, Svps

from ai_core import config

# Model Specific
base_dir = config.base_dir
clf_model_dir = config.clf_model_dir
clf_model_json_file = config.clf_model_json_file
clf_model_vectorizer = config.clf_model_vectorizer
clf_model = config.clf_model
svp_model_dir = config.svp_model_dir
svp_model_dir_core = config.svp_model_dir_core
svp_model_json_file = config.svp_model_json_file

wipe_clf_model_path = config.wipe_clf_model_path
wipe_svp_model_path = config.wipe_svp_model_path


class TestQuery:
    def __init__(self, utterance):
        self.utterance = utterance

    def test_query(self):
        try:

            intent_svp_path = ""
            # validate utterance
            # ---->>>> code here
            if len(self.utterance) > 150:
                raise Exception 

            # Remove punctuation from utterance and create a list of words
            utterance = (RemovePunctuation(self.utterance).remove_punctuation())

            utterance = ''.join(utterance)

            # Classify utterance
            intent = Classification(utterance, clf_model_vectorizer, clf_model).classify_intent()

            #  Remove repeated characters
            utterance = (RemoveRepeatedChars(utterance).remove_repeated_chars())

            utterance = ''.join(utterance)

            # Look for synonyms
            # words = csv_word_replacer(words, 'synonyms.csv')

            # Get ner data from utterance
            # Path to look 

            if os.path.exists(os.path.join(svp_model_dir, intent)):
                intent_svp_path = os.path.join(svp_model_dir, intent)
                svps = Svps(utterance, intent_svp_path).extract_svps()
                if len(svps) > 0:
                    response = {
                        "utterance": utterance,
                        "intent": intent,
                        "slots": svps,
                    }
            else:
                response = {
                "utterance": utterance,
                "intent": intent,
                "slots": []
            }
            print(response)  

            return response   
            
        except:
            user_message = 'Error testing bot'
            print(user_message)
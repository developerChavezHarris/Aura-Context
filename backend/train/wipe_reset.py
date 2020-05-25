import os
import shutil

# Model Specific

from ai_core import config

base_dir = config.base_dir
clf_model_dir = config.clf_model_dir
svp_model_dir_core = config.svp_model_dir_core

wipe_clf_model_path = config.wipe_clf_model_path
wipe_svp_model_path = config.wipe_svp_model_path

class WipeReset:
    def __init__(self):
        pass

    def wipe_clf_model(self):
        try:
            if os.path.exists(wipe_clf_model_path):
                shutil.rmtree(wipe_clf_model_path)
                os.mkdir(wipe_clf_model_path)
            
            user_message = 'Success wiping and resetting classification model'
            print(user_message)
        except:
            user_message = 'Error wiping and resetting classification model'
            print(user_message)

    def wipe_svp_model(self):
        try:
            if os.path.exists(wipe_svp_model_path):
                shutil.rmtree(wipe_svp_model_path)
                os.mkdir(wipe_svp_model_path)
            
            user_message = 'Success wiping and resetting svp model'
            print(user_message)
        except:
            user_message = 'Error wiping and resetting svp model'
            print(user_message)
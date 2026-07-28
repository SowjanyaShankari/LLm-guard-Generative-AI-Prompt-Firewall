from attacks.base_attack import BaseAttack

import base64

import random


class EncodingAttack(BaseAttack):

    def prepare(self):

        method = random.choice(

            [

                "base64",

                "hex"

            ]

        )

        if method == "base64":

            payload = base64.b64encode(

                self.prompt.encode()

            ).decode()

        else:

            payload = self.prompt.encode().hex()

        return {

            "category": "ENCODING",

            "encoding": method,

            "prompt": payload

        }
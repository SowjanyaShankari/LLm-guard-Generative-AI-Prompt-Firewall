from attacks.base_attack import BaseAttack


class UnicodeAttack(BaseAttack):

    HOMOGLYPHS = {

        "a": "а",

        "e": "е",

        "o": "ο",

        "i": "і",

        "c": "с"

    }

    def prepare(self):

        text = self.prompt

        for normal, unicode_char in self.HOMOGLYPHS.items():

            text = text.replace(

                normal,

                unicode_char

            )

        return {

            "category": "UNICODE",

            "prompt": text

        }
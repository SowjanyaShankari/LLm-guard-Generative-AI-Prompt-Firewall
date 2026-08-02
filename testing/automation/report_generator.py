"""
report_generator.py

Creates professional reports.
"""

import json
import csv
import matplotlib.pyplot as plt
from pathlib import Path

from config.settings import REPORT_DIRECTORY


class ReportGenerator:

    def __init__(self):

        self.report_dir = Path(REPORT_DIRECTORY)

        self.report_dir.mkdir(exist_ok=True)

    def save_json(self, summary):

        output = self.report_dir / "summary.json"

        with open(
            output,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                summary,
                file,
                indent=4
            )


    def save_csv(self, summary):

    output = self.report_dir / "summary.csv"

    with open(
        output,
        "w",
        newline="",
        encoding="utf-8"
    ) as file:

        writer = csv.writer(file)

        writer.writerow(
            ["Metric", "Value"]
        )

        for key, value in summary.items():

            writer.writerow(
                [key, value]
            )


    def save_html(self, summary):

    output = self.report_dir / "summary.html"

    html = f"""
        <html>

        <head>

        <title>LLM Guard Report</title>

        </head>

        <body>

        <h1>LLM Guard Report</h1>

        <table border="1">

        """

            for key, value in summary.items():
            
                html += f"""

        <tr>

        <td>{key}</td>

        <td>{value}</td>

        </tr>

        """

            html += """

        </table>

        </body>

        </html>

        """

    with open(
        output,
        "w",
        encoding="utf-8"
    ) as file:

        file.write(html)


    def pass_fail_chart(self, summary):

        plt.figure(figsize=(5,5))

        plt.pie(

            [

                summary["passed"],

                summary["failed"]

            ],

            labels=[

                "PASS",

                "FAIL"

            ],

            autopct="%1.1f%%"

        )

        plt.title(

            "Pass / Fail"

        )

        plt.savefig(

            self.report_dir /

            "pass_fail.png"

        )

        plt.close()

    
    def latency_chart(self, results):

        latency = [

            r["latency"]

            for r in results

            if r["latency"] is not None

        ]

        plt.figure(figsize=(8,4))

        plt.plot(latency)

        plt.title("Latency")

        plt.xlabel("Attack Number")

        plt.ylabel("Milliseconds")

        plt.grid(True)

        plt.savefig(

            self.report_dir /

            "latency.png"

        )

        plt.close()


    def confusion_chart(self, summary):

        labels = [

            "TP",

            "TN",

            "FP",

            "FN"

        ]

        values = [

            summary["true_positive"],

            summary["true_negative"],

            summary["false_positive"],

            summary["false_negative"]

        ]

        plt.figure(figsize=(6,4))

        plt.bar(

            labels,

            values

        )

        plt.title(

            "Confusion Matrix"

        )

        plt.savefig(

            self.report_dir /

            "confusion_matrix.png"

        )

        plt.close()


    
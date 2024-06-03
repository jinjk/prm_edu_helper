import os
from elasticsearch import Elasticsearch
import json

# Password for the 'elastic' user generated by Elasticsearch
ELASTIC_PASSWORD = os.environ.get("ELASTIC_PASSWORD")

# Create the client instance
client = Elasticsearch(
    "https://localhost:9200",
    ca_certs="certs/http_ca.crt",
    basic_auth=("elastic", ELASTIC_PASSWORD)
)

# Successful response!
print(client.info())
# {'name': 'instance-0000000000', 'cluster_name': ...}
for i in range(1, 133):
    jsonFile = f"orc_res/cropped_{i}.json"
    if os.path.exists(jsonFile):
        try:
            with open(jsonFile, "r", encoding='utf-8') as f:
                print(i)
                data = json.load(f)
                detections = data["TextDetections"]
                for det in detections:
                    DetectedText = det["DetectedText"]
                    Polygon = det["ItemPolygon"]
                    advInfo = json.loads(det["AdvancedInfo"])
                    ParagNo = advInfo["Parag"]["ParagNo"] if "Parag" in advInfo else None
                    body={
                        "book": "小学语文三年级下册",
                        "page": i,
                        "ParagNo": ParagNo,
                        "Polygon": Polygon,
                        "text": DetectedText,
                        "path": f'cropped_{i}.jpg'
                    }
                    # client.index(
                    #     index = "pep_books",
                    #     body = body
                    # )
        except Exception as e:
            print(e)
            continue

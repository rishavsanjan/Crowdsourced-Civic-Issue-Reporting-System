from fastapi import FastAPI
from transformers import pipeline

app = FastAPI()

classifier = pipeline(
    "text-classification",
    model="./final_model",
    tokenizer="./final_model"
)

id2label = {
    "LABEL_0": "ANIMAL_HUSBANDRY",
    "LABEL_1": "ELECTRICITY_AND_POWER_SUPPLY",
    "LABEL_2": "GARBAGE_AND_USANITARY_PRACTICES",
    "LABEL_3": "PARKS_AND_RECREATION",
    "LABEL_4": "POLLUTION",
    "LABEL_5": "PUBLIC_TOILETS",
    "LABEL_6": "PUBLIC_TRANSPORT",
    "LABEL_7": "ROADS_AND_FOOTPATHS",
    "LABEL_8": "SEWERAGE_SYSTEMS",
    "LABEL_9": "STREET_LIGHTING",
    "LABEL_10":"TRAFFIC_AND_ROAD_SAFETY",
    "LABEL_11":"TREES_AND_SAPLINGS",
    "LABEL_12":"WATER_SUPPLY_AND_SERVICES"
}

department_map = {
    "Garbage and Unsanitary Practices": "garbage",
    "Roads and Footpaths": "road",
    "Water Supply and Services": "water",
    "Street lighting": "electricity"
}

@app.get("/predict")
def predict(text: str):
    result = classifier(text)[0]

    full_label = id2label[result["label"]]
    simple_label = department_map.get(full_label, "other")

    return {
        "label": simple_label,
        "full_label": full_label,
        "score": result["score"]
    }
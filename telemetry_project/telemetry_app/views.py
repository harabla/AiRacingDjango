from django.shortcuts import render
from firebase_admin import db
import json

def process_data(data):
    if isinstance(data, dict):
        filtered_data = {k: v for k, v in data.items() if v != -1}

        if not filtered_data:
            return {}

        if all(isinstance(key, str) and key.isdigit() for key in filtered_data.keys()):
            max_key = max(map(int, filtered_data.keys()))
            data_list = [None] * (max_key + 1)
            for key, value in filtered_data.items():
                data_list[int(key)] = value
            return data_list
        else:
            return filtered_data

    elif isinstance(data, list):
        return data

    else:
        return {}

def get_chart_data(request, field_name):
    race_id = request.GET.get('raceID', '205425727')
    ref = db.reference(f"racesTest2/{race_id}/competitorData")
    competitor_data = ref.get()

    chart_data = {}
    if competitor_data is not None:
        for index, car_data in enumerate(competitor_data):
            car_number = index + 1
            if isinstance(car_data, dict) and 'RACE' in car_data and field_name in car_data['RACE']:
                raw_data = car_data['RACE'][field_name]
                print(f"Raw data for {field_name}: {raw_data}")  # print the raw data
                processed_data = process_data(raw_data)
                chart_data[car_number] = processed_data

    corrected_chart_data = json.dumps(chart_data, default=str).replace("'", '"')
    return corrected_chart_data


def telemetry(request):
    position = get_chart_data(request, 'position')
    lap_times = get_chart_data(request, 'lapTimes')
    air_temp = get_chart_data(request, 'airTemp')
    track_temp = get_chart_data(request, 'trackTemp')
    class_position = get_chart_data(request, 'classPosition')
    time = get_chart_data(request, 'time')  # fetch time data

    # include time data in the context data
    return render(request, 'telemetry_app/telemetry.html', {
        'lap_times': lap_times,
        'position': position,
        'air_temp': air_temp,
        'track_temp': track_temp,
        'class_position': class_position,
        'time': time,
    })

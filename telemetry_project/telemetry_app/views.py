from django.shortcuts import render
from firebase_admin import db
import json

def telemetry(request):
    ref = db.reference("racesTest2/205425727/competitorData")
    competitor_data = ref.get()

    lap_times = {}
    print("this is a json dump" + json.dumps(competitor_data, indent=4))
    if competitor_data is not None:
        for index, car_data in enumerate(competitor_data):
            car_number = index + 1
            if isinstance(car_data, dict) and 'RACE' in car_data and 'lapTimes' in car_data['RACE']:
                lap_time_data = car_data['RACE']['time']

                # Filter out -1 values
                filtered_lap_time_data = {k: v for k, v in lap_time_data.items() if v != -1}

                # Check if filtered_lap_time_data is a dictionary with numeric keys and convert it to a list
                if isinstance(filtered_lap_time_data, dict) and all(
                        isinstance(key, str) and key.isdigit() for key in filtered_lap_time_data.keys()):
                    max_key = max(map(int, filtered_lap_time_data.keys()))
                    lap_time_list = [None] * (max_key + 1)
                    for key, value in filtered_lap_time_data.items():
                        lap_time_list[int(key)] = value
                    lap_times[car_number] = lap_time_list
                else:
                    lap_times[car_number] = filtered_lap_time_data

    # Correct the JSON data before passing it to the template
    corrected_lap_times = json.dumps(lap_times, default=str).replace("'", '"')

    return render(request, 'telemetry_app/telemetry.html', {'lap_times': corrected_lap_times})
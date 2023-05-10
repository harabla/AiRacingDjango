from django.shortcuts import render
from firebase_admin import db
import json

def telemetry(request):
    # Get the race ID from the request's GET parameters, use a default value if not provided
    race_id = request.GET.get('raceID', '205425727')

    # Update the reference with the race ID
    ref = db.reference(f"racesTest2/{race_id}/competitorData")
    competitor_data = ref.get()

    lap_times = {}
    if competitor_data is not None:
        for index, car_data in enumerate(competitor_data):
            car_number = index + 1
            if isinstance(car_data, dict) and 'RACE' in car_data and 'lapTimes' in car_data['RACE']:
                lap_time_data = car_data['RACE']['time']

                # Filter out -1 values
                filtered_lap_time_data = {k: v for k, v in lap_time_data.items() if v != -1}

                # Check if filtered_lap_time_data is a dictionary with numeric keys and convert it to a list
                if isinstance(filtered_lap_time_data, dict) and all(isinstance(key, str) and key.isdigit() for key in filtered_lap_time_data.keys()):
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

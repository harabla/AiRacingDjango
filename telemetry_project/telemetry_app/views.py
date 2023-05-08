from django.shortcuts import render
from firebase_admin import db
import json

def telemetry(request):
    ref = db.reference("races/202352116/competitorData")
    competitor_data = ref.get()

    lap_times = {}
    for index, car_data in enumerate(competitor_data):
        car_number = index + 1
        if isinstance(car_data, dict) and 'RACE' in car_data and 'lapTimes' in car_data['RACE']:
            lap_time_data = car_data['RACE']['lapTimes']

            # Check if lap_time_data is a dictionary with numeric keys and convert it to a list
            if isinstance(lap_time_data, dict) and all(isinstance(key, str) and key.isdigit() for key in lap_time_data.keys()):
                max_key = max(map(int, lap_time_data.keys()))
                lap_time_list = [None] * (max_key + 1)
                for key, value in lap_time_data.items():
                    lap_time_list[int(key)] = value
                lap_times[car_number] = lap_time_list
            else:
                lap_times[car_number] = lap_time_data

    return render(request, 'telemetry_app/telemetry.html', {'lap_times': lap_times})

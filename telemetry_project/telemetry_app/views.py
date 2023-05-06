from django.shortcuts import render
from firebase_admin import db
import json


def telemetry(request):
    ref = db.reference("races/202343115/competitorData")
    competitor_data = ref.get()

    lap_times = {}
    for index, car_data in enumerate(competitor_data):
        car_number = index + 1
        if isinstance(car_data, dict) and 'RACE' in car_data and 'lapTimes' in car_data['RACE']:
            lap_times[car_number] = car_data['RACE']['lapTimes']

    return render(request, 'telemetry_app/telemetry.html', {'lap_times': lap_times})

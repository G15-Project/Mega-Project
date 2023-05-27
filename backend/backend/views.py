from django.shortcuts import render, redirect
from django.http import JsonResponse
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from pymongo import MongoClient
import numpy as np
import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
matplotlib.use('Agg')

# DB connection
client = MongoClient('mongodb+srv://sujay:sujay@database.komvzuw.mongodb.net/?retryWrites=true&w=majority')
database = client['database']

dataframe = pd.DataFrame(list(database.data.find()))
dataframe = dataframe.drop("_id", axis='columns')

# Create your views here.
def HomeView(request):
    return render(request, template_name='index.html')

class GetTitles(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"titles": dataframe.iloc[:, 0].fillna("")}, 200)
    
class GetText(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, id):
        return Response({"text": dataframe.iloc[id, 1]}, 200)

class Preprocess(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        text = request.data.get('text')
        if text:
            def preprocessing(x):
                import re
                x = re.sub(r"[^a-zA-Z]", " ", x)
                x = x.split(" ")
                x = ''.join(x)
                return x
            return Response({"text": preprocessing(text), "n": len(text.split(" "))}, 200)
        else:
            return Response({}, 400)

class Calculate(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        text = request.data.get('text')
        query = request.data.get('query')
        if text != None and query != None:
            N = len(text)
            P = text.find(query)+1
            W = len(query)
            E = text.count(query)

            purity = W*P/N
            entropy = W*E/N
            plt.ioff()
            plt.bar(["Purity", "Entropy"], [purity, entropy], color=["red", "blue"])
            import io
            import base64
            my_stringIObytes = io.BytesIO()
            plt.savefig(my_stringIObytes, format='jpg')
            my_stringIObytes.seek(0)
            my_base64_jpgData = base64.b64encode(my_stringIObytes.read()).decode()
            plt.close()
            plt.ion()

            output = f"Document Length: {N}\nLength of Word: {W}\nWord Count: {E}\nWord Location: {P}\nPurity: {purity}\nEntropy: {entropy}"

            sentences = [sent for sent in sent_tokenize(text) if query in sent]
            sentences = np.array(sent_tokenize(text))
            vectorizer = TfidfVectorizer(analyzer="word")
            datasetVectorized = vectorizer.fit_transform(sentences)
            queryVectorized = vectorizer.transform([query])
            cosine_sim_arr = cosine_similarity(datasetVectorized, queryVectorized)
            cosine_sim_arr_enumerated = np.array(list(enumerate(cosine_sim_arr.flatten())))
            cosine_sim_arr_enumerated_sort = np.array(sorted(cosine_sim_arr_enumerated, key=lambda x: x[1], reverse=True))
            sim_sentences = " ".join(sentences[cosine_sim_arr_enumerated_sort[:, 1] > 0])
            return Response({"calString": output, "graph": my_base64_jpgData, "sentences": sim_sentences}, 200)
        else:
            return Response({}, 400)

@csrf_exempt
@login_required(login_url="/admin/login/")
def AddContentView(request):
    if request.method == "GET":
        if request.user.is_authenticated:
            return render(request, template_name='index.html')
        else:
            return redirect("/admin/login/?next=/add/")
    elif request.method == "POST":
        global dataframe
        data = json.loads(request.body)
        title = data.get('title')
        content = data.get('content')
        if title and content:
            database.data.insert_one({"title": title, "content": content})
            dataframe = pd.concat([dataframe, pd.DataFrame([[title, content]], columns=["title", "content"])], ignore_index=True)
            return JsonResponse({}, status=200)
        else:
            return JsonResponse({}, status=400)
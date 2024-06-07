from django import forms
from .models import Question, Reply, Review

class QuestionForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = ['text']

class ReplyForm(forms.ModelForm):
    class Meta:
        model = Reply
        fields = ['text']

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['text', 'rating']
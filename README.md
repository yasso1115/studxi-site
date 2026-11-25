# STUDXI GAMING

Website: https://yasso1115.github.io/studxi-site/

موقع قناة STUDXI GAMING على يوتيوب: https://www.youtube.com/@STUDXIGAMING

6 صفحات بالعربي (الرئيسية، الفيديوهات، عن القناة، المجتمع، الأطقم، تواصل)، شات بسيط، و OS Mode (واجهة ماك على الكمبيوتر وآيفون على الموبايل).

## تحديث الفيديوهات
GitHub Action اسمه "Sync YouTube videos" بيشتغل كل 30 دقيقة تقريباً (جدولة GitHub مش مضمونة بالدقيقة، فممكن التأخير) وبيجيب الفيديوهات من YouTube Data API ويحفظها في data/videos.json. مفتاح الـ API محفوظ كـ Actions secret باسم YOUTUBE_API_KEY ومش موجود في الملفات.

## ملاحظات
- GitHub بيوقف الـ workflows المجدولة لو الريبو ما فيهوش نشاط 60 يوم.
- OS Mode شبه واجهة ماك/iOS، مش نسخة طبق الأصل.

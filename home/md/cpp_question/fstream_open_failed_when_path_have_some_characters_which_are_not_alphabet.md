한글 경로명으로 인해 파일 입출력이 안되는 경우
===

> cpp, fstream, locale, 한글 경로

현상
---

프로젝트에 추가될 모듈을 작성하던 중, dll 과 테스트 프로그램을 만들고, 간단하게 내 작업PC에서 확인한 후,
현장에서 테스트 프로그램을 실행해 보았다. 생각했던 것처럼 잘 동작한다.

이제, 본 프로그램에 이식하여 해 볼 차례이다.

이식한 후 실행해본 결과, 이상한 에러가 발생한다. **설정 파일이 없다**는 에러가 발생한다.

파일 위치 확인하고, 다시 실행해도 역시나 동일한 에러가 발생한다. 황당하다.

혹시나 해서 경로를 찍어보도록 했다. 정상적으로 잘 찍힌다. 그런데... 한글이 포함되어 있다.. 경로에.

작업PC에서 경로에 한글을 넣어서 실행해보니, 역시나 작업PC에서도 설정파일이 없다고 에러를 뱉는다.

한글로 된 경로명이 문제인 것을 파악했다.

locale 문제인건가...

왠만하면 cpp로 작성하려고,

```cpp
std::locale loc("Korean");
fstream file;
file.imbue(loc);
```

를 해봤는데 안된다. 디버깅 해보니, fstream::open 안에서 호출되는 mbstowcs\_s에서 글자가 이상하게 변환된다.

mbstowcs\_s 는 다시 \_mbstowcs\_s\_l 로

\_mbstowcs\_s\_l 안에서 \_LocaleUpdate 객체 생성을

\_LocaleUpdate 생성자에서 \_getptd 함수를 호출하는데,

받아온 \_locale_tstruct 값이 **ptlocinfo값의 codepage가 0**이다.

해결방법
---

**프로그램 기본 로케일(default locale of program)을 원하는 언어로 초기화** 해주면 된다.

std::locale 클래스의 static 함수 global을 사용하면 된다.

```cpp
std::locale::global(std::locale("Korean"), std::locale::all);
```

**ptlocinfo값의 codepage도 949**로 나온다.

뒤의 std::locale::all은 생략 가능하다.

mbstowcs\_s 의 변환도 정상적으로 잘 된다.

C 함수인 setlocale을 사용해도 동일한 효과를 볼 수 있다.

```cpp
::setlocale(LC_ALL, "Korean");
```

참고자료
---

- [MSDN locale::global][1]



[1]: https://msdn.microsoft.com/en-us/library/9dzxxx2c(v=vs.90).aspx

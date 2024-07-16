---
title: "warning: LF will be replaced by CRLF in .gitignore."
tags: "Git"
date: "2024-07-02 03:02"
---

### 무슨 상황이었나?

- 패키지를 초기 설정 하고 난 뒤, 설정한 파일을 `git add .` 하는 시점에 발생 (`OS: Windows`)

### 왜?

- OS 에 따른 줄 끝 형식에 의해 파생된 문제 Windows 는 기본적으로 CRLF(Carriage Return Line Feed, \r\n) 을 사용하고, macOS, Unix 계열은 LF(Line Feed, \n)를 사용.
- `Git` 은 일반적으로 문자 비교를 통해서 파일이 마지막으로 체크인 된 후 변경된 내역이 있는지 확인한다.
- 여기서 `LF` 와 `CRLF`가 위와 같은 경고나 다른 문제를 발생
- 내 경우는 `git add .` 로 인해 staging 영역으로 이동하는 과정에서 줄 끝 정규화에 의해 발생

### 해결방안

##### 1. 로컬 내 `git config` 설정(줄 끝 정규화 활성화 제어)

기본적으로 Git 설치 시에 core.autocrlf 는 false 로 설정(core.eol=native OS를 따르도록 설정 됨)

```shell
$ git config --global core.autocrlf [true | false | input]
```

- Windows 에서 작업 시, Git의 `core.autocrlf` 설정을 `true` 로 설정, `checkout` 시에 CRLF 로 변환 `commit` 시에 LF 로 변환
- macOS, Unix 계열도 작업 시 `core.autocrlf` 설정을 `input` 으로 하여 `checkout` 시에 변환하지 않고, `commit` 시에 `LF` 로 변환

##### 2. `.gitattributes` 파일 사용(추천)

> GPT-4o: .gitattributes 파일은 Git에서 파일 속성과 동작을 정의하는 설정 파일입니다. 특히 여러 운영체제 간에 협업할 때 발생하는 줄 끝(Line Ending) 문제를 해결하는 데 유용합니다. Windows와 macOS 간의 협업에서 줄 끝 형식을 일관되게 유지하여 경고나 오류를 방지할 수 있습니다.

- 일반적으로 위 설정은 모든 개발자들에게 각자 자신의 OS 에 맞게 설정을 하라고 요구하는 것이나 다름 없음.
- 저장소 root에 `.gitattributes` 파일을 생성하고, `* text=auto eol=lf` 내용을 입력하여 해결
- 먼저 `* text=auto` 는 모든 텍스트 파일에 대해서 원본을 유지시킴
- `eol=lf` 는 `end-of-line` 은 LF로 고정하겠다는 의미
- 모든 사용자에 대해서 정해진 설정을 유지할 수 있음
- 다만 실제로 windows 파일을 관리하는 경우가 있을 수 있음.
  이런 경우는 아래와 같은 설정을 통해서 crlf 설정을 유지함

```
# 모든 텍스트 파일에 대해 LF 유지
* text=auto eol=lf

# Windows 배치 파일에 대해 CRLF 유지
*.bat text eol=crlf
*.cmd text eol=crlf
```

##### 3. Visual Studio Code 를 쓴다면?

- Ctrl(Command) + , 를 통해서 설정에 진입
- `Eol` 검색 `\n`으로 설정

### 왜 Windows 는 \r\n 을 사용할까?(GPT-4o)

#### 역사적 배경

텔레타이프라이터 시절:

CR(Carriage Return): 프린트 헤드를 줄의 시작으로 되돌림.
LF(Line Feed): 용지를 한 줄 아래로 전진시킴.
초기 텔레타이프 기계는 `CR과 LF를 사용`하여 `한 줄의 인쇄를 마치고 다음 줄로 이동`했습니다 .

CP/M 운영 체제:
MS-DOS의 전신인 CP/M은 텔레타이프라이터와 호환성을 유지하기 위해 CRLF를 줄 끝 형식으로 사용했습니다 .
MS-DOS는 CP/M의 영향을 받아 동일한 줄 끝 형식을 채택하게 되었습니다.

MS-DOS 및 Windows:
MS-DOS는 CP/M의 CRLF 줄 끝 형식을 그대로 채택했습니다.
MS-DOS의 후속작인 Windows도 이를 이어받아 CRLF를 줄 끝 형식으로 사용하게 되었습니다.

#### 기술적 이유

하위 호환성:
초기 개인용 컴퓨터 환경에서 사용된 많은 소프트웨어와 하드웨어가 CRLF 줄 끝 형식에 의존하고 있었습니다.
하위 호환성을 유지하기 위해 Windows는 CRLF를 줄 끝 형식으로 사용하게 되었습니다 .

프린터 및 기타 장치와의 호환성:
당시 사용된 프린터 및 기타 출력 장치들은 CRLF를 줄 끝 형식으로 인식하고 처리했습니다.
이러한 장치들과의 호환성을 위해 CRLF 사용이 필요했습니다 .
인터넷 프로토콜의 영향
여러 인터넷 프로토콜(RFC 0821, RFC 1939, RFC 2060, RFC 2616 등)은 줄 끝 시퀀스로 CR+LF를 지정했습니다.
이러한 표준의 영향으로 다양한 시스템에서 CRLF가 사용되었습니다.

#### 결론

Windows가 CRLF를 줄 끝 형식으로 사용하게 된 배경은 주로 역사적 유산과 하위 호환성 때문입니다. 초기 컴퓨팅 환경에서 텔레타이프라이터와 CP/M의 영향을 받아 CRLF를 사용하게 되었고, 이를 MS-DOS와 Windows가 계승했습니다. 또한, 인터넷 프로토콜 표준과의 일관성을 유지하기 위해 CRLF가 채택되었습니다.

### Ref

[github - configuring-git-to-handle-line-endings](https://docs.github.com/en/get-started/getting-started-with-git/configuring-git-to-handle-line-endings)  
[git-config core.autocrlf](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coreautocrlf)  
[git - gitattributes](https://git-scm.com/docs/gitattributes)  
[crlf vs. lf](https://www.aleksandrhovhannisyan.com/blog/crlf-vs-lf-normalizing-line-endings-in-git/#a-simple-gitattributes-config)  
[Why is the lien terminator CR+LF?](https://devblogs.microsoft.com/oldnewthing/20040318-00/?p=40193)  
[vscode env](https://stackoverflow.com/a/73985251)

FROM ubuntu:22.04

RUN apt-get update && \
    apt-get -y install software-properties-common tzdata curl unzip zip

RUN add-apt-repository ppa:deadsnakes/ppa && \
    apt-get -y install python3.8 openjdk-8-jdk

RUN curl -s "https://get.sdkman.io" | bash
RUN bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && sdk install kotlin && sdk install gradle"

ENV PATH=$PATH:/root/.sdkman/candidates/gradle/8.0.2/bin

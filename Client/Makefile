EXEC := Aquarena

BUILD_DIR := build
SRC_DIR := src
PROTO_DIR := ../Protocol
PROTO_GENERATED_DIR := proto

LIBRARIES := $(shell pkg-config --cflags --libs sfml-window sfml-graphics sfml-audio sfml-network protobuf)

OPTIONS := -Wall -O3

SOURCES := $(shell find $(SRC_DIR) -name '*.cpp')
PROTO_SOURCES := $(shell find $(PROTO_DIR) -name '*.proto')
PROTO_GENERATED_CC := $(PROTO_SOURCES:$(PROTO_DIR)/%.proto=$(PROTO_GENERATED_DIR)/%.pb.cc)
PROTO_GENERATED_H := $(PROTO_SOURCES:$(PROTO_DIR)/%.proto=$(PROTO_GENERATED_DIR)/%.pb.h)
PROTO_OBJECTS := $(PROTO_GENERATED_CC:$(PROTO_GENERATED_DIR)/%.pb.cc=$(PROTO_GENERATED_DIR)/%.pb.o)

OBJECTS := $(SOURCES:.cpp=.o) $(PROTO_OBJECTS)
DEPENDS := $(SOURCES:.cpp=.d) $(PROTO_SOURCES:$(PROTO_DIR)/%.proto=$(PROTO_GENERATED_DIR)/%.pb.d)

.PHONY: all clean run generateClass

all: $(BUILD_DIR)/$(EXEC)

$(BUILD_DIR)/$(EXEC): $(OBJECTS)
	@mkdir -p $(BUILD_DIR)
	$(CXX) $(OPTIONS) $^ -o $@ $(LIBRARIES)

# Rule for generating .pb.cc and .pb.h files from .proto files
$(PROTO_GENERATED_DIR)/%.pb.cc $(PROTO_GENERATED_DIR)/%.pb.h: $(PROTO_DIR)/%.proto
	@mkdir -p $(PROTO_GENERATED_DIR)
	protoc -I=$(PROTO_DIR) --cpp_out=$(PROTO_GENERATED_DIR) $<

# Rule for compiling .pb.cc files into .pb.o files
$(PROTO_GENERATED_DIR)/%.pb.o: $(PROTO_GENERATED_DIR)/%.pb.cc
	$(CXX) -MMD -MP -c $< -o $@

-include $(DEPENDS)

$(BUILD_DIR)/%.o : $(SRC_DIR)/%.cpp
	$(CXX) -MMD -MP -c $< -o $@

clean:
	rm -f $(BUILD_DIR)/$(EXEC)
	rm -f $(OBJECTS)
	rm -f $(DEPENDS)
	rm -f $(PROTO_GENERATED_CC) $(PROTO_GENERATED_H) $(PROTO_OBJECTS) $(DEPENDS)

run:
	$(BUILD_DIR)/$(EXEC)

generateClass:
	@if [ -z "$(hpp_sf)" ] || [ -z "$(cpp_sf)" ] || [ -z "$(out_dir)" ] || [ -z "$(name)" ]; then \
		echo "Usage example: make generateClass hpp_sf=skel/Scene.hpp.skel cpp_sf=skel/Scene.cpp.skel out_dir=src/Scene/Game/ name=Game"; \
		exit 1; \
	fi
	ruby task/generateClass.rb $(hpp_sf) $(cpp_sf) $(out_dir) $(name)

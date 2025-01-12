EXEC := Aquarena

BUILD_DIR := build
SRC_DIR := src
PROTO_DIR := ../Protocol
PROTO_GENERATED_DIR := proto

LIBS := $(shell pkg-config --libs sfml-window sfml-graphics sfml-audio sfml-network protobuf)
CXXFLAGS := $(shell pkg-config --cflags sfml-window sfml-graphics sfml-audio sfml-network)
CXXFLAGS += -std=c++20 -O3 -DPROTOBUF_USE_DLLS -Wnon-virtual-dtor -DNOMINMAX

PROTO_SOURCES := $(shell find $(PROTO_DIR) -name '*.proto')
PROTO_GENERATED_CC := $(PROTO_SOURCES:$(PROTO_DIR)/%.proto=$(PROTO_GENERATED_DIR)/%.pb.cc)
PROTO_GENERATED_H := $(PROTO_SOURCES:$(PROTO_DIR)/%.proto=$(PROTO_GENERATED_DIR)/%.pb.h)
PROTO_OBJECTS := $(PROTO_GENERATED_CC:$(PROTO_GENERATED_DIR)/%.pb.cc=$(PROTO_GENERATED_DIR)/%.pb.o)

SOURCES := $(shell find $(SRC_DIR) -name '*.cpp')
OBJECTS := $(SOURCES:$(SRC_DIR)/%.cpp=$(BUILD_DIR)/%.o) $(PROTO_OBJECTS)
DEPENDS := $(SOURCES:$(SRC_DIR)/%.cpp=$(BUILD_DIR)/%.d)

.PHONY: all clean run generate_class

all: $(BUILD_DIR)/$(EXEC)

$(BUILD_DIR)/$(EXEC): $(OBJECTS)
	@mkdir -p $(BUILD_DIR)
	$(CXX) $(CXXFLAGS) $^ -o $@ $(LIBS)

$(PROTO_GENERATED_DIR)/%.pb.cc $(PROTO_GENERATED_DIR)/%.pb.h: $(PROTO_DIR)/%.proto
	@mkdir -p $(PROTO_GENERATED_DIR)
	protoc -I=$(PROTO_DIR) --cpp_out=$(PROTO_GENERATED_DIR) $<

$(PROTO_GENERATED_DIR)/%.pb.o: $(PROTO_GENERATED_DIR)/%.pb.cc
	$(CXX) -c $< -o $@

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.cpp $(PROTO_OBJECTS)
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -MMD -MP -c $< -o $@

-include $(DEPENDS)

clean:
	rm -f $(BUILD_DIR)/$(EXEC)
	rm -f $(OBJECTS)
	rm -f $(DEPENDS)
	rm -f $(PROTO_GENERATED_CC) $(PROTO_GENERATED_H) $(PROTO_OBJECTS)

run:
	$(BUILD_DIR)/$(EXEC) $(log_level)

generate_class:
	@if [ -z "$(hpp_sf)" ] || [ -z "$(cpp_sf)" ] || [ -z "$(out_dir)" ] || [ -z "$(name)" ]; then \
		echo "Usage example: make generate_class hpp_sf=skel/Scene.hpp.skel cpp_sf=skel/Scene.cpp.skel out_dir=src/Scene/Game/ name=Game"; \
		exit 1; \
	fi
	ruby task/generate_class.rb $(hpp_sf) $(cpp_sf) $(out_dir) $(name)

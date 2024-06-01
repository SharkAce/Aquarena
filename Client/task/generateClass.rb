require 'fileutils'

def generate_file(hpp_template_file, cpp_template_file, output_location, name)
  # Read the template files
  hpp_template_content = File.read(hpp_template_file)
  cpp_template_content = File.read(cpp_template_file)

  include_guard = name.upcase()

  # Replace placeholders with the provided name
  hpp_replaced_content = hpp_template_content.gsub('%%INCLUDE-GUARD%%', include_guard)
  hpp_replaced_content = hpp_replaced_content.gsub('%%NAME%%', name)
  cpp_replaced_content = cpp_template_content.gsub('%%NAME%%', name)

  # Determine the output file path
  hpp_output_file = File.join(output_location, "#{name}.hpp")
  cpp_output_file = File.join(output_location, "#{name}.cpp")

  # Write the replaced content to the output file
  File.write(hpp_output_file, hpp_replaced_content)
  File.write(cpp_output_file, cpp_replaced_content)

  include_file_path = File.join(output_location, 'include.hpp')
  include_content = File.read(include_file_path)

  include_lines = include_content.split("\n")
  include_guard_end_index = include_lines.index { |line| line.strip.start_with?("#endif") }
  include_lines.insert(include_guard_end_index -1, "#include \"#{name}.hpp\"")

  # Write the modified content back to include.hpp
  File.write(include_file_path, include_lines.join("\n"))
end

# Check if the correct number of arguments is provided
if ARGV.length != 4
  puts "Wrong argument count"
  exit 1
end

hpp_template_file = ARGV[0]
cpp_template_file = ARGV[1]
output_location = ARGV[2]
name = ARGV[3]

# Check if the hpp template file exists
unless File.exist?(hpp_template_file)
  puts "Template file not found: #{hpp_template_file}"
  exit 1
end

# Check if the cpp template file exists
unless File.exist?(cpp_template_file)
  puts "Template file not found: #{cpp_template_file}"
  exit 1
end

# Check if the include file exists
unless File.exist?(File.join(output_location, 'include.hpp'))
  puts "Include file not found: #{output_location}/include.hpp"
  exit 1
end

# Check if the output directory exists
unless Dir.exist?(output_location)
  puts "Output directory not found: #{output_location}"
  exit 1
end

generate_file(hpp_template_file, cpp_template_file, output_location, name)
puts "File generated: #{name}.hpp, #{name}.cpp"

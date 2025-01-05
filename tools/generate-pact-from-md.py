# generate-pact-from-md.py

import json

def main():
	# Input file name:
	input_file_name = "../3.0.0/paper-board-pulp-warehouse-logistics.md"
	# Output file
	output_file_name = "../3.0.0/mock/papiNet.PACT.generated.json"

	# Pact skeleton:
	pact = {
		"consumer": {
			"name": "Logistics Supplier"
		},
		"provider": {
			"name": "Supplier"
		},
		"interactions": []
	}
	interaction = {}

	# Open the input file name:
	f = open(input_file_name, "r")
	input_file_lines = f.read().splitlines()

	# Read the input file line by line:
	interaction_opened = False
	i = 0
	while i < len(input_file_lines):
		# Search for (starting with) "####":
		search = "####"
		if input_file_lines[i].startswith(search):
			print(f"Found \"{input_file_lines[i]:s}\" text at position {i:d}, while searching for (staring with) \"{search}\".")

			print(f"Get interaction_opened: {interaction_opened}.")
			if interaction_opened == True:
				interaction_opened = False # Closing
				print(f"Set interaction_opened = {interaction_opened}.")
				# Append the current interaction to the Pact, and reset it afterwards:
				pact["interactions"].append(interaction)
				interaction = {}

			# Search for (starting with)"#### Interaction" (on the same line):
			search = "#### Interaction"
			if input_file_lines[i].startswith(search):
				print(f"Found \"{input_file_lines[i]:s}\" text at position {i:d}, while searching for \"{search}\".")

				interaction_opened = True
				print(f"Set interaction_opened = {interaction_opened}.")

				# providerState:
				state_begin_search = "#### Interaction "
				state_end_search   = " ("
				state_begin_pos = input_file_lines[i].find(state_begin_search) + 5
				state_end_pos   = input_file_lines[i].find(state_end_search)
				if state_end_pos == -1:
					providerState = input_file_lines[i][state_begin_pos:]
				else:
					providerState = input_file_lines[i][state_begin_pos:state_end_pos]
				providerState = providerState.replace(" ", "_")
				print(f"providerState = \"{providerState}\".")
				# type:
				type = "Synchronous/HTTP"
				print(f"type = \"{type}\".")
				# description:
				description = input_file_lines[i][5:]
				print(f"description = \"{description}\".")
				# Update the interaction:
				interaction["providerState"] = providerState
				interaction["type"] = type
				interaction["description"] = description

		# Search for "curl --request ":
		search = "curl --request "
		if input_file_lines[i].startswith(search) and interaction_opened == True:
			print(f"Found \"{input_file_lines[i]:s}\" text at position {i:d}, while searching for \"{search}\".")

			# request.method:
			method_begin_search = search
			method_end_search   = " \\"
			method_begin_pos = input_file_lines[i].find(method_begin_search) + len(method_begin_search)
			method_end_pos   = input_file_lines[i].find(method_end_search)
			method = input_file_lines[i][method_begin_pos:method_end_pos]
			print(f"method = \"{method}\".")
			# request.path & request.query
			path_begin_search = "--url 'http://localhost:3030"
			path_end_search   = "' \\"
			path_begin_pos = input_file_lines[i+1].find(path_begin_search) + len(path_begin_search)
			path_end_pos   = input_file_lines[i+1].find(path_end_search)
			path = input_file_lines[i+1][path_begin_pos:path_end_pos]
			query = path.partition("?")[2]
			path = path.partition("?")[0]
			print(f"path = \"{path}\".")
			# Update the interaction:
			interaction["request"] = {
				"method": method,
				"path": path
			}
			if len(query) != 0:
				interaction["request"]["query"] = query

		# Search for "<!-- file: ":
		search = "<!-- file: "
		if input_file_lines[i].startswith(search):
			print(f"Found \"{input_file_lines[i]:s}\" text at position {i:d}, while searching for \"{search}\".")

			# body:
			file_begin_search = search
			file_end_search   = " -->"
			file_begin_pos = input_file_lines[i].find(file_begin_search) + len(file_begin_search)
			file_end_pos   = input_file_lines[i].find(file_end_search)
			body_file = input_file_lines[i][file_begin_pos:file_end_pos]
			print(f"body_file = \"{body_file}\".")
			f = open(body_file, "r")
			body = json.load(f)
			# Update interaction:
			interaction["response"] = {
				"status": 200,
				"headers": {
					"Content-Type": "application/json; charset=utf-8"
				},
				"body": body
			}

		# Incerement to the next line:
		i = i + 1

	json_pact = json.dumps(pact, indent=2)

	# print(json_pact)

	f = open(output_file_name, "w")
	f.write(json_pact)
	f.close()

if __name__ == "__main__":
	main()

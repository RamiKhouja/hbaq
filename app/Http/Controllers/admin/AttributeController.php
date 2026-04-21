<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\AttOption;
use Illuminate\Http\Request;

class AttributeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attributes = Attribute::with('options')->get();

        return inertia('Admin/Attribute/Index', [
            'attributes' => $attributes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Admin/Attribute/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name_en' => 'required|string',
            'name_ar' => 'required|string',
            'type' => 'nullable|string',
            'multi_vals' => 'nullable|boolean',
            'filtrable' => 'nullable|boolean',
            'options' => 'required'
        ]);

        $name = array(
            'en' => $request->input('name_en'),
            'ar' => $request->input('name_ar')
        );

        $attribute = new Attribute();
        $attribute->name=$name;
        $attribute->type=$request->input('type');
        $attribute->multi_vals=$request->input('multi_vals');
        $attribute->filtrable=$request->input('filtrable');
        $attribute->save();

        $options = $request->input('options');
        foreach($options as $option) {
            $attoption = new AttOption();
            $attoption->value = $option;
            $attoption->attribute_id = $attribute->id;
            $attoption->save();
        }
        
        return redirect()->route('admin.attributes.index')->with('success', 'Attribute created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Attribute $attribute)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $attribute = Attribute::with('options')->find($id);
        return inertia('Admin/Attribute/Edit', [
            'attribute' => $attribute,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attribute $attribute)
    {
        $request->validate([
            'name_en' => 'required|string',
            'name_ar' => 'required|string',
            'type' => 'nullable|string',
            'multi_vals' => 'nullable|boolean',
            'filtrable' => 'nullable|boolean'
        ]);

        $name = array(
            'en' => $request->input('name_en'),
            'ar' => $request->input('name_ar')
        );

        $attribute->update([
            'name' => $name,
            'type' => $request->input('type'),
            'multi_vals' => $request->input('multi_vals'),
            'filtrable' => $request->input('filtrable')
        ]);

        // Handle options
        if ($request->has('options') && is_array($request->options)) {
            $existingOptionIds = $attribute->options->pluck('id')->toArray();
            $receivedOptionIds = [];

            foreach ($request->options as $optionData) {
                $option = AttOption::updateOrCreate(
                    ['id' => $optionData['id']],
                    [
                        'value' => $optionData['value'],
                        'attribute_id' => $attribute->id,
                    ]
                );

                $receivedOptionIds[] = $option->id;
            }

            // Delete options that are not in the received data
            $optionsToDelete = array_diff($existingOptionIds, $receivedOptionIds);
            AttOption::destroy($optionsToDelete);
        }

        return redirect()->route('admin.attributes.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attribute $attribute)
    {
        $attribute->delete();
        return redirect()->route('admin.attributes.index');
    }
}
